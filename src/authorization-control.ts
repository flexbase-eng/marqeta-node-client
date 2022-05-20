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

  /*
   * Function to take an Authorization Control token with an optional fields
   * argument, send those to Marqeta, and have an Authorization Control
   * updated and returned to the caller.
   */
  async byTokenId(search: {
    token?: string,
    fields?: string[],
  } = {}): Promise<{
    success: boolean,
    body?: AuthorizationControl,
    error?: MarqetaError,
  }> {
    const {
      token,
      fields = ''
    } = search
    const resp = await this.client.fire('GET',
      `authcontrols/${token}`,
      { fields }
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
