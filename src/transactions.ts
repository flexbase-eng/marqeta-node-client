'use strict'

import type {
  Marqeta, MarqetaError,
  MarqetaOptions,
} from './'

export interface Transaction {
  count?: bigint;
  startIndex: bigint;
  fields?: string[];
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  type: string;
  userToken?: string;
  businessToken?: string;
  actingUserToken?: string;
  cardToken?: string;
  merchantToken?: string;
  campaignToken?: string;
  state?: string;
  version?: string;
  verbose?: boolean;
}

export interface TransactionList {
  count?: bigint;
  startIndex?: bigint;
  endIndex?: bigint;
  isMore?: boolean;
  data?: Transaction[];
}

export class TransactionsApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  async list(search: {
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
    startDate?: string,
    endDate?: string,
    type?: string,
    userToken?: string,
    businessToken?: string,
    actingUserToken?: string,
    cardToken?: string,
    merchantToken?: string,
    campaignToken?: string,
    state?: string,
    version?: string,
    verbose?: boolean,
  } = {}): Promise<{
    success: boolean,
    body?: TransactionList,
    error?: MarqetaError,
  }> {
    const {
      count = 100,
      startIndex = 0,
      fields = '',
      sortBy = 'lastModifiedTime',
      startDate = '',
      endDate = '',
      type = '',
      userToken = '',
      businessToken = '',
      actingUserToken = '',
      cardToken = '',
      merchantToken = '',
      campaignToken = '',
      state = '',
      version = '',
    } = search
    const resp = await this.client.fire('GET',
      'transactions',
      { count, startIndex, fields, startDate, endDate, type, userToken,
        businessToken, actingUserToken, cardToken, merchantToken, campaignToken,
        state, version, sortBy },
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
