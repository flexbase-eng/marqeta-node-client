'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface FundingAch {
  token: string;
  userToken: string;
  routingNumber: string;
  nameOnAccount: string;
  isDefaultAccount: boolean;
  accountNumber: string;
  accountType: string;
  verificationNotes: string;
  verificationOverride: boolean;
}

export class FundingAchApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
