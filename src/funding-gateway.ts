'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'
import { MarqetaError } from './'

export interface FundingGateway {
  name: string;
  url: string;
  token: string;
  active: boolean;
  basicAuthUsername: string;
  basicAuthPassword: string;
  customHeader: any;
  createdTime?: string;
  lastModifiedTime?: string;
  status?: string;
  version?: string;
  account?: string;
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
    body?: FundingGateway,
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

  /*
   * Function that takes a funding source token Id, sends that to Marqeta,
   * which returns the funding source information.
   */
  async get(token: string): Promise<{
    success: boolean,
    body?: FundingGateway,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `fundingsources/programgateway/${token}`,
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

  /*
   * Function that takes a series of monetary funding parameters, sends
   * those to Marqeta, which in turn updates a Card funding source.
   */
  async update(source: Partial<FundingGateway>): Promise<{
    success: boolean,
    body?: FundingGateway,
    error?: MarqetaError,
  }> {
    /* eslint-disable no-unused-vars */
    const {
      token,
      createdTime,
      status,
      account,
      version,
      lastModifiedTime,
      ...updateOptions
    } = source
    /* eslint-enable no-unused-vars */
    const resp = await this.client.fire('PUT',
      `fundingsources/programgateway/${source.token}`,
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
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
  }

}
