'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface FundingProgram {
  name: string;
  token: string;
  active: boolean;
  account?: string;
  createdTime?: string;
  lastModifiedTime?: string;
}

export class FundingProgramApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
