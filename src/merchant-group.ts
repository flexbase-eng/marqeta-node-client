'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface MerchantGroup {
  name: string;
  active?: boolean;
  mids?: string[];
  token?: string;
  reasonCode: string;
  reason?: string;
  channel: string;
  userToken: string;
}

export interface MerchantGroupList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: MerchantGroup[];
}

export class MerchantGroupApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take optional MerchantGroup arguments, send those to Marqeta,
   * and have a new Merchant Group created and returned to the caller.
   */
  async create(group: Partial<MerchantGroup>): Promise<{
    success: boolean,
    merchantGroup?: MerchantGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'merchantgroups',
      undefined,
      group,
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
    return { success: !resp?.payload?.errorCode, merchantGroup: { ...resp.payload } }
  }

  /*
   * Function to take a Merchant Group Token Id, send that to Marqeta, and have
   * the Merchant Group returned to the caller.
   */
  async byTokenId(token: string): Promise<{
    success: boolean,
    merchantGroup?: MerchantGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `merchantgroups/${token}`,
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
    return { success: !resp?.payload?.errorCode, merchantGroup: { ...resp.payload } }
  }
}
