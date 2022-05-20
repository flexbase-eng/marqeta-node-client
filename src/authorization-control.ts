'use strict'

import type {
  Marqeta,
  MarqetaError,
  MarqetaOptions,
} from './'

export interface Association {
  userToken?: string;
  cardProductToken?: string;
}

export interface Merchant {
  token?: string;
  name: string;
  association?: Association;
  mid?: string;
  merchantGroupToken: string;
  startTime: string;
  endTime: string;
}

export interface MerchantList {
  count?: bigint;
  startIndex?: bigint;
  endIndex?: bigint;
  isMore?: boolean;
  data?: Merchant[];
}

export interface AuthorizationControl {
  token?: string;
  name?: string;
  association?: Association;
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
   * Function to take an Authorization Control token with an optional filter
   * fields argument, send those to Marqeta, and have an Authorization Control
   * returned.
   */
  async byTokenId(search: {
    token?: string,
    fields?: string[],
  } = {}): Promise<{
    success: boolean,
    body?: AuthorizationControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `authcontrols/${search.token}`,
      { ...search }
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
  async update(control: Partial<AuthorizationControl>): Promise<{
    success: boolean,
    body?: AuthorizationControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('PUT',
      `authcontrols/${control.token}`,
      undefined,
      control,
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
   * Function to take a series of arguments, most of which are optional,
   * pass them to Marqeta, and have a *paged* list of Authorization Controls
   * returned either for a Card Product, or a User, and that conforms to the
   * optional search criteria such as count, fields, sortBy, startIndex.
   */
  async list(search: {
    cardProduct?: string,
    user?: string,
    count?: number,
    startIndex?: string,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    body?: AuthorizationControlList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'businesses',
      { ...search }
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
   * Function to take a series of optional Merchant arguments, pass them to
   * Marqeta, and have a new Merchant Identifier exemption created and returned.
   */
  async createMerchant(merchant: Partial<Merchant>): Promise<{
    success: boolean,
    body?: Merchant,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'authcontrols/exemptmids',
      undefined,
      merchant,
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
