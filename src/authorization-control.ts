'use strict'

import type {
  Marqeta,
  MarqetaError,
  MarqetaOptions,
} from './'

export interface AuthorizationControl {
  token?: string;
  name?: string;
  association?: {
    userToken?: string;
    cardProductToken?: string;
  };
  merchantScope: {
    mid?: string;
    mcc?: string;
    mccGroup?: string;
  };
  startTime: string;
  endTime: string;
  active?: boolean;
}

export interface AuthorizationControlList {
  count?: bigint;
  startIndex?: bigint;
  endIndex?: bigint;
  isMore?: boolean;
  data?: AuthorizationControl[];
}

export class AuthorizationControlApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take an Authorization Control argument, send that to Marqeta,
   * and have an Authorization Control created and returned to the caller.
   */
  async create(auth: Partial<AuthorizationControl>): Promise<{
    success: boolean,
    body?: AuthorizationControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'authcontrols',
      undefined,
      { ...auth },
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
