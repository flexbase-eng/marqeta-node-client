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

/*
 * Simple function used to weed out undefined and null query params before
 * trying to place them on the call.
 */
function something(arg: any) {
  return arg || arg === false || arg === 0 || arg === ''
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
 * Marqeta has several standard fields in their responses - status, and the
 * paging URLs, and if they are unnecessary, like `null` URLs, it makes
 * sense to clear them out and "deClutter" the response data for the caller.
 * that's what this function is doing.
 */
export function deClutter(arg: any): any {
  // see if we have anything to do at all...
  if (isEmpty(arg) || typeof arg !== 'object') {
    return arg
  }
  let ret = { ...arg }
  // Marqeta can send back several empty fields on all responses... clean it
  if (isEmpty(ret.nextUrl)) {
    delete ret.nextUrl
  }
  if (isEmpty(ret.previousUrl)) {
    delete ret.previousUrl
  }
  if (ret.status === 200) {
    delete ret.status
  }
  return ret
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
