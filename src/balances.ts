'use strict'

import { Marqeta, MarqetaError, MarqetaOptions } from './index'

export interface Balances {
  gpa: {
    currencyCode: string;
    ledgerBalance: number;
    availableBalance: number;
    pendingCredits: number;
    balances: {
      USD: {
        currencyCode: string;
        ledgerBalance: number;
        availableBalance: number;
        pendingCredits: number;
        }
      }
  };
  links: {
    rel: string;
    method: string;
    href: string;
  }
}

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
    balances?: Balances,
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
