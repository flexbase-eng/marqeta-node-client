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
      undefined,
      { ...funding }
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
    return { success: !resp?.payload?.errorCode, funding: { ...resp.payload } }
  }

  /*
   * Function to take a Program Funding Source token Id, send that to Marqeta,
   * and have them return the Program Funding Source information.
   */
  async retrieve(token: string): Promise<{
    success: boolean,
    funding?: FundingProgram,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `/fundingsources/program/${token}`,
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
    return { success: !resp?.payload?.errorCode, funding: { ...resp.payload } }
  }

  /*
   * Function to take some Program Funding source attributes, send those to
   * Marqeta, and have the Program Funding source updated and the information
   * returned.
   */
  async update(funding: Partial<FundingProgram>): Promise<{
    success: boolean,
    funding?: FundingProgram,
    error?: MarqetaError,
  }> {
    /* eslint-disable no-unused-vars */
    const {
      token,
      account,
      createdTime,
      lastModifiedTime,
      ...updateOptions
    } = funding
    /* eslint-enable no-unused-vars */

    const resp = await this.client.fire('PUT',
      `/fundingsources/program/${token}`,
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
    return { success: !resp?.payload?.errorCode, funding: { ...resp.payload } }
  }
}
