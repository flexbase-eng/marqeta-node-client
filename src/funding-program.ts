'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'
import { MarqetaError } from './'

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

  /*
   * Function to take the attributes of a new Program Funding source, create that
   * in Marqeta, and return the Program Funding source information.
   */
  async create(funding: Partial<FundingProgram>): Promise<{
    success: boolean,
    funding?: FundingProgram,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'fundingsources/program',
      {},
      { ...funding })
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
    return { success: !resp?.payload?.errorCode, funding: { ...resp.payload } }
  }
}
