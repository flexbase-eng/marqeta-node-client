'use strict'

import { Marqeta, MarqetaOptions } from './index'

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
}
