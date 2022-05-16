import fetch from 'node-fetch'
import path from 'path'
import FormData = require('formdata')
import camelCaseKeys from 'camelcase-keys'
import { URL } from 'url'

import snakecaseKeys from 'snakecase-keys'

const ClientVersion = require('../package.json').version

import { BusinessApi } from './business'
import { UserApi } from './user'
import { CardApi } from './card'
import { CardProductApi } from './card-product'
import { WebhooksApi } from './webhooks'
import { FundingGatewayApi } from './funding-gateway'
import { FundingSourceApi } from './funding-source'

const PROTOCOL = 'https'
const MARQETA_HOST = 'sandbox-api.marqeta.com/v3'

/*
 * These are the acceptable options to the creation of the Client:
 *
 *   {
 *     host: "sandbox-api.marqeta.com/v3
 *     apiAppToken: '705b5bc0-c4d3-11ec-9d64-0242ac120002',
 *     apiAccessToken: 'abbykj26-z8a1-21ea-8c64-92d6ac1a0002'
 *   }
 *
 * and the construction of the Client will use this data for all
 * calls made to Marqeta.
 */
export interface MarqetaOptions {
  host?: string;
  apiAppToken?: string;
  apiAccessToken?: string;
}

/*
 * These are the standard error objects from Marqeta - and will be returned
 * from Marqeta for any bad condition. We will allow these - as well as just
 * strings in the errors being returned from the calls.
 */
export interface MarqetaError {
  type: string;
  message?: string;
  error?: string;
  status?: number;
  marqetaStatus?: number;
}

/*
 * This is the main constructor of the Marqeta Client, and
 * will be called with something like:
 *
 *   import { Marqeta } from "marqeta-node-client"
 *   const client = new Marqeta({
 *     apiAppToken: '54321dcba77884',
 *     apiAccessToken: 'abcd1234efgh'
 *   })
 */
export class Marqeta {
  host: string
  apiAppToken: string
  apiAccessToken: string
  private accessToken: string
  business: BusinessApi
  user: UserApi
  card: CardApi
  cardProduct: CardProductApi
  webHooks: WebhooksApi
  fundingGatewayApi: FundingGatewayApi
  fundingSourceApi: FundingSourceApi

  constructor (options?: MarqetaOptions) {
    this.host = options?.host || MARQETA_HOST
    this.apiAppToken = options?.apiAppToken!
    this.apiAccessToken = options?.apiAccessToken!
    this.accessToken = Buffer
      .from(`${this.apiAppToken}:${this.apiAccessToken}`)
      .toString('base64')
    this.business = new BusinessApi(this, options)
    this.user = new UserApi(this, options)
    this.card = new CardApi(this, options)
    this.cardProduct = new CardProductApi(this, options)
    this.webHooks = new WebhooksApi(this, options)
    this.fundingGatewayApi = new FundingGatewayApi(this, options)
    this.fundingSourceApi = new FundingSourceApi(this, options)
  }

  /*
   * Function to fire off a GET, PUT, POST, (method) to the uri, preceded
   * by the host, with the optional query params, and optional body, and
   * puts the 'apiKey' into the headers for the call, and fires off the call
   * to the Marqeta host and returns the response.
   */
  async fire(
    method: string,
    uri: string,
    query?: { [index: string] : number | string | string[] | boolean },
    body?: object | object[] | FormData,
  ): Promise<{ response: any, payload?: any }> {
    // build up the complete url from the provided 'uri' and the 'host'
    let url = new URL(PROTOCOL+'://'+path.join(this.host, uri))
    if (query) {
      Object.keys(query).forEach(k => {
        if (something(query[k])) {
          url.searchParams.append(k, query[k].toString())
        }
      })
    }
    const isForm = isFormData(body)
    // make the appropriate headers
    let headers = {
      Accept: 'application/json',
      Authorization : `Basic ${this.accessToken}`,
      'X-Marqeta-Client-Ver': ClientVersion,
    } as any
    if (!isForm) {
      headers = { ...headers, 'Content-Type': 'application/json' }
      // body exist only on POST requests...
      if (body) {
        body = cleanRequestData(body, method, uri)
      }
    }
    // allow a few retries on the authentication token expiration
    let response
    for (let cnt = 0; cnt < 3; cnt++) {
      // now we can make the call... see if it's a JSON body or a FormData one...
      try {
        response = await fetch(url, {
          method: method,
          body: isForm ?
            (body as any) :
            (body ? JSON.stringify(body) : undefined),
          headers,
        })
        const payload = camelCaseKeys((await response?.json()), { deep: true })
        return { response, payload }
      } catch (err) {
        return { response }
      }
    }
    // this will mean we retried, and still failed
    return { response }
  }
}

/*
 * Simple function used to weed out undefined and null query params before
 * trying to place them on the call.
 */
function something(arg: any) {
  return arg || arg === false || arg === 0
}

/*
 * Function to examine the argument and see if it's 'empty' - and this will
 * work for undefined values, and nulls, as well as strings, arrays, and
 * objects. If it's a regular data type - then it's "not empty" - but this
 * will help know if there's something in the data to look at.
 */
export function isEmpty(arg: any): boolean {
  if (arg === undefined || arg === null) {
    return true
  } else if (typeof arg === 'string' || Array.isArray(arg)) {
    return arg.length == 0
  } else if (typeof arg === 'object') {
    return Object.keys(arg).length == 0
  }
  return false
}

/*
 * Simple predicate function to return 'true' if the argument is a FormData
 * object - as that is one of the possible values of the 'body' in the fire()
 * function. We have to handle that differently on the call than when it's
 * a more traditional JSON object body.
 */
function isFormData(arg: any): boolean {
  let ans = false
  if (arg && typeof arg === 'object') {
    ans = (typeof arg._boundary === 'string' &&
        arg._boundary.length > 20 &&
        Array.isArray(arg._streams))
  }
  return ans
}

/*
 * Convenience function to create a MarqetaError based on a simple message
 * from the Client code. This is an easy way to make MarqetaError instances
 * from the simple error messages we have in this code.
 */
export function mkError(message: string): MarqetaError {
  return {
    type: 'client',
    message,
  }
}

/*
 * Function to recursively remove all the 'undefined' and 'null' values from
 * the provided Object and return what's left. This will not cover the
 * complete boolean falsey set.
 */
export function removeEmpty(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(itm => removeEmpty(itm)) }
  else if (typeof obj === 'object') {
    return Object.entries(obj)
      .filter(([_k, v]) => !isEmpty(v))
      .reduce(
        (acc, [k, v]) => (
          { ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }
        ), {}
      )
  }
  return obj
}

/*
 * These are the problem fields for sending to each of the indicated
 * method:ure pairs in the keys. These are something that the caller
 * can provide, but we need to filter out because Marqeta will error
 * out if we pass them.
 */
const problemFields: { [index: string]: string[] } = {
  'POST:usertransitions': ['createdTime', 'lastModifiedTime', 'password'],
  'POST:businesstransitions': ['createdTime', 'lastModifiedTime', 'password'],
}
/*
 * Marqeta is picky about the JSON body data that we send on some calls,
 * and in order to make it possible for the user to pass in more than
 * is needed, we need to file out the problematic fields - based on the
 * method and uri that's being called. This function does that.
 */
function cleanRequestData(obj: any, method: string, uri: string): any {
  (problemFields[method + ':' + uri]
  || ['createdTime', 'lastModifiedTime', 'password', 'status'])
    .forEach(f => delete obj[f])
  return snakecaseKeys(removeEmpty(obj))
}

/*
 * Function that returns an Array based on the argument. If the arg is an Array,
 * then returns the argument, if it's a different type, an Array is returned
 * within the value of the argument.
 */
export function toArray(arg: any): any[] {
  if (Array.isArray(arg)) {
    return arg
  } else if (isEmpty(arg)) {
    return []
  }
  return [arg]
}
