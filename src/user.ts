'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface UserIdentification {
  type: string;
  value: string;
}

export interface User {
  token?:string;
  firstName?: string;
  lastName?: string;
  email?:string;
  password?:string;
  identifications?: UserIdentification[];
  birthDate?:string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?:string;
  gender?:string;
  usesParentAccount?: boolean;
  metadata: any;
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
}



