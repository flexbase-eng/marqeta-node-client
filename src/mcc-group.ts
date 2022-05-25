'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface HoldIncrease {
  type: string;
  value: number;
}

export interface AuthorizationControls {
  holdIncrease?: HoldIncrease;
  holdExpirationDays: number;
}

export interface MccGroup {
  token?: string;
  name: string;
  mccs: string[];
  active?: boolean;
  config?: {
    authorizationControls: AuthorizationControls;
  };
  lastModifiedTime: string;
  createdTime: string;
}

export interface MccGroupList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: MccGroup[];
}

export class MccGroupApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take the attributes of a new MCC Group, create that in Marqeta,
   * and return that new MCC Group information. If no attributes are provided,
   * a new MCC Group account will still be created and its token ID returned.
   */
  async create(mccGroup: Partial<MccGroup>): Promise<{
    success: boolean,
    mccGroup?: MccGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'mccgroups',
      undefined,
      { ...mccGroup })
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
    return { success: !resp?.payload?.errorCode, mccGroup: { ...resp.payload } }
  }

  /*
   * Function to take a MCC Group token Id, send that to Marqeta, and return
   * the MCC Group information.
   */
  async get(token: string): Promise<{
    success: boolean,
    mccGroup?: MccGroup,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `mccgroups/${token}`,
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
    return { success: !resp?.payload?.errorCode, mccGroup: { ...resp.payload } }
  }

  /*
   * Function to take a series of MCC Group arguments, most of which are
   * optional, as input, pass them to Marqeta and have them return a *paged*
   * list of MCC Groups that fit the list criteria. If no list arguments are
   * given, this returns a list of *all* the MCC Groups in Marqeta.
   */
  async list(search: {
    mcc?: string,
    count?: number,
    startIndex?: number,
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    mccGroups?: MccGroupList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'mccgroups',
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
    return { success: !resp?.payload?.errorCode, mccGroups: { ...resp.payload } }
  }

  /*
  * Function to take some MCC Group attributes and update that MCC Group in
  * Marqeta with these values. The return value will be the updated MCC Group.
  */
  async update(group: Partial<MccGroup>): Promise<{
    success: boolean,
    mccGroup?: MccGroup,
    error?: MarqetaError,
  }> {
    /* eslint-disable no-unused-vars */
    const {
      token,
      createdTime,
      lastModifiedTime,
      ...updateOptions
    } = group
    /* eslint-enable no-unused-vars */

    const resp = await this.client.fire('PUT',
      `mccgroups/${group?.token}`,
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
    return { success: !resp?.payload?.errorCode, mccGroup: { ...resp.payload } }
  }
}
