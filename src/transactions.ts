'use strict'

import type {
  Marqeta, MarqetaError,
  MarqetaOptions,
} from './'

export interface Transaction {
  token?: string;
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

  /*
   * Function to take a set of optional arguments, send those to Marqeta, and
   * return a list of transactions.  These can be transactions for a business,
   * user, acting user, merchant, or campaign.
   */
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
    transactions?: TransactionList,
    error?: MarqetaError,
  }> {
    console.log(`\nsearch: ${JSON.stringify(search)}`)
    const resp = await this.client.fire('GET',
      'transactions',
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
    return { success: !resp?.payload?.errorCode, transactions: { ...resp.payload } }
  }

  /*
   * Function to take a Transaction token Id and return the Transaction
   * information for that token Id.
   */
  async retrieve(token: string): Promise<{
    success: boolean,
    transaction?: Transaction,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `transactions/${token}`,
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
    return { success: !resp?.payload?.errorCode, transaction: { ...resp.payload } }
  }

  /*
   * Function to take a set of optional arguments, send those to Marqeta, and
   * return a list of related transactions.  These can be transactions for a business,
   * user, acting user, merchant, or campaign.
   */
  async related(search: {
    token?: string,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
    startDate?: string,
    endDate?: string,
    type?: string,
    state?: string,
    version?: string,
    verbose?: boolean,
  } = {}): Promise<{
    success: boolean,
    transactions?: TransactionList,
    error?: MarqetaError,
  }> {
    if (!search.token) {
      return {
        success: true, transactions: {
          count: BigInt(0),
          startIndex: BigInt(0),
          endIndex: BigInt(0),
          isMore: false,
          data: [],
        }
      }
    }
    const resp = await this.client.fire('GET',
      `transactions/${search.token}/related`,
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
    return { success: !resp?.payload?.errorCode, transactions: { ...resp.payload } }
  }
}
