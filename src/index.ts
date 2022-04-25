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

  constructor (options?: MarqetaOptions) {
    this.host = options?.host || MARQETA_HOST
    this.apiAppToken = options?.apiAppToken!
    this.apiAccessToken = options?.apiAccessToken!
    this.accessToken = Buffer
      .from(`${this.apiAppToken}:${this.apiAccessToken}`)
      .toString('base64')
  }
}
