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
      internationalEnabled?: boolean;
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

  /*
   * Function to take a Account Holder Group token Id, send that to Marqeta,
   * and have them return the Account Holder Group information.
   */
  async retrieve(token: string): Promise<{
    success: boolean,
    group?: AccountHolderGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `/accountholdergroups/${token}`,
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

  /*
   * Function to take some Account Holder group attributes, send those to
   * Marqeta, and have the Account Holder group updated and the information
   * returned.
   */
  async update(group: Partial<AccountHolderGroup>): Promise<{
    success: boolean,
    group?: AccountHolderGroup,
    error?: MarqetaError,
  }> {
    /* eslint-disable no-unused-vars */
    const {
      token,
      createdTime,
      lastModifiedTime,
      ...updateOptions
    } = group
    /* eslint-enable no-unused-vars */

    const resp = await this.client.fire('PUT',
      `/accountholdergroups/${token}`,
      undefined,
      updateOptions,
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
