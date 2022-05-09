'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface WebHook {
  name: string;
  token?: string;
  active?: boolean;
  config: {
    url?: string;
    secret?: string;
    basicAuthUsername: string;
    basicAuthPassword: string;
    customHeader: any;
    useMtls: boolean;
  },
  events: string[];
}

export interface BusinessList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: WebHook[];
}

export class WebhooksApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   *  A function to list the Marqeta webhooks. A boolean
   *  argument of true will return all 'active' webhooks,
   *  while a boolean argument of false' will return all
   *  'inactive' webhooks with the default set to true.
   */
  async list(search: {
    active?: boolean,
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    body?: BusinessList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'webhooks',
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
        }
      }
    }
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
  }

}
