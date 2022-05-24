'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface Headers {
  [index: string] : number | string | boolean;
}

export interface Webhook {
  token?: string;
  name: string;
  active?: boolean;
  config?: {
    url?: string;
    secret?: string;
    basicAuthUsername: string;
    basicAuthPassword: string;
    customHeader?: Headers;
    useMtls?: boolean;
  },
  events: string[];
}

export interface WebhooksList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: Webhook[];
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
    webhooksList?: WebhooksList,
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
    return { success: !resp?.payload?.errorCode, webhooksList: { ...resp.payload } }
  }

  /*
   * A function to update an existing Marqeta Webhook based upon
   * an updated webhook as the input argument. The required Marqeta
   * parameters to update a webhook are: url, events, basicAuthName,
   * basicAuthPassword, name, and. token.
   */
  async update (hook: Webhook): Promise<{
    success: boolean,
    webhook?: Webhook,
    error?: MarqetaError,
  }> {
    const { token, ...body } = hook  // eslint-disable-line
    const resp = await this.client.fire('PUT',
      `webhooks/${hook.token}`,
      undefined,
      body,
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
    return { success: !resp?.payload?.errorCode, webhook: { ...resp.payload } }
  }

  /*
   * Function to take the attributes of a new Webhook, create that
   * in Marqeta, and return the Webhook information.
   */
  async create (hook: Partial<Webhook>): Promise<{
    success: boolean,
    webhook?: Webhook,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'webhooks',
      undefined,
      { ...hook },
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
    return { success: !resp?.payload?.errorCode, webhook: { ...resp.payload } }
  }

  /*
   * Function to retrieve a Webhook by its token Id.
   */
  async byTokenId (token: string): Promise<{
    success: boolean,
    webhook?: Webhook,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `webhooks/${token}`,
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
    return { success: !resp?.payload?.errorCode, webhook: { ...resp.payload } }
  }
}
