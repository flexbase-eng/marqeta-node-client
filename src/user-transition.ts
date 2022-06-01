'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface Transition {
  idempotentHash?: string;
  token?: string;
  status: string;
  reasonCode: string;
  reason?: string;
  channel: string;
  userToken: string;
}

export interface TransitionList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: Transition[];
}

export class UserTransitionApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to a User token, status, reason code, and channel, send
   * those to Marqeta, and transition a User account between states.
   */
  async create(status: Partial<Transition>): Promise<{
    success: boolean,
    transition?: Transition,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'usertransitions',
      undefined,
      status,
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
    return { success: !resp?.payload?.errorCode, transition: { ...resp.payload } }
  }

  /*
   * Function to take a Transition token Id, send that to Marqeta, and have the
   * transition status information returned.
   */
  async byTokenId(token: string): Promise<{
    success: boolean,
    transition?: Transition,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `usertransitions/${token}`,
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
    return { success: !resp?.payload?.errorCode, transition: { ...resp.payload } }
  }

  /*
   * Function to take a list of search parameters, send those to Marqeta, and
   * have a list of User transition statuses returned for a User, where
   * "token" correlates to a Marqeta User account, "count" determines
   * how many business transitions to return, "startIndex" is the sort order
   * index of the first resource in the response, "fields" determines  which
   * Transition fields to include in the response (leaving this empty returns
   * all Transition fields for a User Transition), and "sortBy" is the
   * Transition field by which to sort the response, e.g. lastModifiedData,
   * createdTime, etc.
   */
  async list(search: {
    token?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    transitionList?: TransitionList,
    error?: MarqetaError,
  }> {
    const {
      token = '',
      count = 100,
      startIndex = 0,
      fields = '',
      sortBy = 'lastModifiedTime',
    } = search
    if (!token) {
      return {
        success: true, transitionList: {
          count: BigInt(0),
          startIndex: BigInt(0),
          endIndex: BigInt(0),
          isMore: false,
          data: [],
        }
      }
    }
    const resp = await this.client.fire('GET',
      `usertransitions/user/${token}`,
      { count, startIndex, fields, sortBy },
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
    return { success: !resp?.payload?.errorCode, transitionList: { ...resp.payload } }
  }
}
