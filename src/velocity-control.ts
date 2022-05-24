'use strict'

import type {
  Marqeta, MarqetaError,
  MarqetaOptions,
} from './'

export interface VelocityControl {
  token?: string;
  name?: string;
  association?: {
    userToken?: string;
    businessToken?: string;
  }
  merchantScope: {
    mid?: string;
    mcc?: string;
    mccGroup?: string;
  }
  usageLimit?: number;
  approvalsOnly?: boolean;
  includePurchases?: boolean;
  includeWithdrawals?: boolean;
  includeTransfers?: boolean;
  includeCashback?: boolean;
  includeCredits?: boolean;
  currencyCode: string;
  amountLimit: number;
  velocityWindow: string;
  active?: boolean;
}

export interface VelocityControlList {
  count?: bigint;
  startIndex?: bigint;
  endIndex?: bigint;
  isMore?: boolean;
  data?: VelocityControl[];
}

export class VelocityControlApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a Velocity Control argument, send that to Marqeta, and
   * have a Velocity Control created and returned to the caller.
   */
  async create(control: Partial<VelocityControl>): Promise<{
    success: boolean,
    velocity?: VelocityControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'velocitycontrols',
      undefined,
      { ...control },
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
    return { success: !resp?.payload?.errorCode, velocity: { ...resp.payload } }
  }

  /*
   * Function to take a set of optional arguments, send that to Marqeta, and
   * have a list of Velocity Controls returned to the caller.
   */
  async list(search: {
    cardProduct?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  }): Promise<{
    success: boolean,
    velocityList?: VelocityControlList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'velocitycontrols',
      { ...search },
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
    return { success: !resp?.payload?.errorCode, velocityList: { ...resp.payload } }
  }

  /*
   * Function to take a Velocity token and some optional arguments, send those
   * to Marqeta, and have the found Velocity Control returned to the caller.
   */
  async byTokenId(token: string, search?: {
    fields?: string[],
  }): Promise<{
    success: boolean,
    velocity?: VelocityControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `velocitycontrols/${token}`,
      { ...search },
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
    return { success: !resp?.payload?.errorCode, velocity: { ...resp.payload } }
  }

  /*
   * Function to take a Velocity token and some optional arguments, send those
   * to Marqeta, and update a Velocity Control.
   */
  async update(control: Partial<VelocityControl>): Promise<{
    success: boolean,
    velocity?: VelocityControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('PUT',
      `velocitycontrols/${control.token}`,
      undefined,
      { ...control },
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
    return { success: !resp?.payload?.errorCode, velocity: { ...resp.payload } }
  }

  /*
   * Function to take a user token with a set of optional arguments, send those
   * to Marqeta, and have a list of User Velocity Controls returned to
   * the caller.
   */
  async byUser(search: {
    token?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  }): Promise<{
    success: boolean,
    velocityList?: VelocityControlList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `velocitycontrols/user/${search.token}/available`,
      { ...search },
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
    return { success: !resp?.payload?.errorCode, velocityList: { ...resp.payload } }
  }
}
