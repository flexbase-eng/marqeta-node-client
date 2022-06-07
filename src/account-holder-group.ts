'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'
import { MarqetaError } from './'

export interface AccountHolderGroup {
  token?: string;
  name?: string;
  config?: {
    kycRequired?: string;
    isReloadable?: boolean;
    realTimeFeeGroupToken?: string;
    preKycControls?: {
      cashAccessEnabled?: boolean;
      internationalEnabled?:	boolean;
      balanceMax?: number;
      enableNonProgramLoads?: boolean;
      isReloadablePreKyc?: boolean;
    }
  };
  createdTime?: string;
  lastModifiedTime?: string;
}

export class AccountHolderGroupApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take the attributes of a new Account Holder Group, create that
   * in Marqeta, and return the Account Holder Group information.
   */
  async create(group: Partial<AccountHolderGroup>): Promise<{
    success: boolean,
    group?: AccountHolderGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      '/accountholdergroups',
      undefined,
      { ...group }
    )
    // catch any errors...
    if (resp?.payload?.errorCode) {
      return {
        success: false,
        error: {
          type: 'marqeta',
          error: resp?.payload?.errorMessage,
          status: resp?.payload?.errorCode,
        },
      }
    }
    return { success: !resp?.payload?.errorCode, group: { ...resp.payload } }
  }
}
