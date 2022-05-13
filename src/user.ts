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

export interface UserIdentification {
  type: string;
  value: string;
}

export interface User {
  token?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  identifications?: UserIdentification[];
  birthDate?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  gender?: string;
  usesParentAccount?: boolean;
  metadata?: any;
  status?: string;
}

export interface UserList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: User[];
}

export class UserApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a series of list arguments, most of which are optional,
   * as input, pass them to Marqeta, and have them return a *paged* list of
   * Users that fit the list criteria. If no list arguments are given,
   * this returns a list of *all* the User accounts in Marqeta.
   */
  async list(search: {
    count?: number,
    startIndex?: number,
    searchType?: string,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    body?: UserList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'users',
      search,
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
   * Function to take a token Id and return the Marqeta User account associated
   * with that token Id.
   */
  async byTokenId(userTokenId: string): Promise<{
    success: boolean,
    body?: User,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `users/${userTokenId}`,
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
   * Function to take some User attributes and update the User in
   * Marqeta with these values. The return value will be the updated User.
   */
  async update(user: Partial<User>): Promise<{
    success: boolean,
    body?: User,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('PUT',
      `users/${user?.token}`,
      undefined,
      user,
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
   * Function to take the attributes of a new User account, create that
   * in Marqeta, and return the account information. If no attributes are
   * provided, a new User account will still be created and its
   * token Id returned.
   */
  async create(user: Partial<User>): Promise<{
    success: boolean,
    body?: User,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'users',
      undefined,
      user,
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
   * Function to take some User attributes that will be sent to Marqeta to
   * search for an existing user.
   */
  async search(user: Partial<User>): Promise<{
    success: boolean,
    body?: UserList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'users/lookup',
      undefined,
      user,
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
   * Function to a User token, status, reason code, and channel, send
   * those to Marqeta, and transition a User account between states.
   */
  async transition(status: Partial<Transition>): Promise<{
    success: boolean,
    body?: Transition,
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
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
  }

  /*
   * Function to take a Transition token Id, send that to Marqeta, and have the
   * transition status information returned.
   */
  async getTransition(token: string): Promise<{
    success: boolean,
    body?: Transition,
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
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
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
  async listTransition(search: {
    token?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    body?: TransitionList,
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
        success: true, body: {
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
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
  }
}
