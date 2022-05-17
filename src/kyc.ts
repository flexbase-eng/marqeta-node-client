'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'
import { MarqetaError } from './'

export interface Kyc {
  notes?: string;
  token?: string;
  userToken?: string;
  businessToken?: string;
  manualOverride?: boolean;
  referenceId?: string;
}

export class KycApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  async verify(source: {
    notes?: string,
    userToken?: string,
    businessToken?: string,
    manualOverride?: boolean,
    referenceId?: string,
  } = {}): Promise<{
    success: boolean,
    body?: Kyc,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'kyc',
      undefined,
      { ...source }
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