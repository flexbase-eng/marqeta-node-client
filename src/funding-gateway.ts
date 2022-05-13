'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'
import { MarqetaError } from './'
import { Card } from './card'

export interface FundingGateway {
  name: string;
  url: string;
  token: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
  customHeader: any;
}

export class FundingGatewayApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function that takes a series of monetary funding parameters, sends those to
   * Marqeta, which in turn creates a funding source to fund issued Marqeta
   * cards.
   */
  async create(source: Partial<FundingGateway>): Promise<{
    success: boolean,
    body?: Card,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'fundingsources/programgateway',
      undefined,
      source,
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
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
  }
}
