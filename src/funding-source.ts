'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

export class FundingSourceApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}