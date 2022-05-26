'use strict'

import { Marqeta, MarqetaError, MarqetaOptions } from './index'

export class BalancesApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to retrieve the following general purpose account (GPA) balance
   * details for a user or business by token Id.
   */
  async byTokenId(token: string): Promise<{
    success: boolean,
    balances?: any,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `balances/${token}`,
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
    return {
      success: !resp?.payload?.errorCode,
      balances: { ...resp.payload }
    }
  }
}
