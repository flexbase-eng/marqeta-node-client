'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

import snakecaseKeys from 'snakecase-keys'

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
      snakecaseKeys(search),
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
