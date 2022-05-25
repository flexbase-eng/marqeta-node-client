'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface HoldIncrease {
  type: string;
  value: number;
}

export interface AuthorizationControls {
  holdIncrease?: HoldIncrease;
  holdExpirationDays: number;
}

export interface MccGroup {
  token?: string;
  name: string;
  mccs: string[];
  active?: boolean;
  config?: {
    authorizationControls: AuthorizationControls;
  };
}

export class MccGroupApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take the attributes of a new MCC Group, create that in Marqeta,
   * and return that new MCC Group information. If no attributes are provided,
   * a new MCC Group account will still be created and its token ID returned.
   */
  async create(mccGroup: Partial<MccGroup>): Promise<{
    success: boolean,
    mccGroup?: MccGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'mccgroups',
      undefined,
      { ...mccGroup })
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
    return { success: !resp?.payload?.errorCode, mccGroup: { ...resp.payload } }
  }
}
