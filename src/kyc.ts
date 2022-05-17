'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface Kyc {
  notes?: string;
  token?: string;
  userToken?: string;
  businessToken?: string;
  manualOverride?: boolean;
  referenceId?: string;
}

export interface KycList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: Kyc[];
}

export class KycApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a set of arguments, send those Marqeta, and have Marqeta
   * perform KYC, or KYB, on the user or business based upon which token is
   * populated: userToken or businessToken.
   */
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

  /*
   * Function that takes a Marqeta User token and gets a list of the KYC
   * results for that User.
   */
  async userResults(search :{
    token?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    body?: KycList,
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
      `kyc/user/${token}`,
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

  /*
   * Function that takes a Marqeta Business token and gets a list of the KYC
   * results for that Business.
   */
  async businessResults(search :{
    token?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    body?: KycList,
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
      `kyc/business/${token}`,
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

  /*
   * Function to take a KYC or KYB token, send that to Marqeta, and have
   * the KYC result returned.
   */
  async byTokenId(token: string): Promise<{
    success: boolean,
    body?: Kyc,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `kyc/${token}`,
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
