import type { Marqeta, MarqetaOptions, MarqetaError } from './'

export interface BusinessIdentifications {
  type: string;
  value: string;
}

export interface IncorporationType {
  incorporationType: string;
  stateOfIncorporation: string;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Personal {
  firstName: string;
  lastName: string;
  home: Address;
}

export interface Meta {
  name: string;
}

export interface Business {
  token?: string,
  createdTime: string,
  metadata: Meta,
  accountHolderGroupToken: string,
  lastModifiedTime: string,
  status: string,
  attestorName: string;
  attestationConsent: string;
  attestationDate: string;
  businessNameLegal: string;
  businessNameDba: string;
  identifications: BusinessIdentifications[];
  incorporation: IncorporationType;
  dateEstablished: string;
  proprietorOrOfficer: Personal;
}

export interface BusinessList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data: Business[];
}
export class BusinessApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a series of list arguments, most of which are optional,
   * as input, pass them to Marqeta, and have them return a *paged* list of
   * Businesses that fit the list criteria. If no list arguments are given,
   * this returns a list of *all* the Businesses in Marqeta.
   */
  async list(search: {
    count?: number,
    startIndex?: number,
    businessNameDba?: string,
    businessNameLegal?: string,
    searchType?: string,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    businesses?: BusinessList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire(
      'GET',
      'businesses',
      { ...search }
    )
    // see if there are none to show - that's a 404, but not an error
    if (resp?.response?.status == 404) {
      return {
        success: true,
        businesses: {
          count: BigInt(0),
          data: [],
          endIndex: BigInt(0),
          startIndex: BigInt(0),
          isMore: false
        }
      }
    }
    // ...now catch the other errors...
    if (resp?.response?.status >= 400) {
      // build error message from all possible sources...
      let error = resp?.payload?.error || resp?.payload?.message
      if (resp.payload?.detail) {
        error = `${resp.payload.title}: ${resp.payload.detail}`
      }
      return {
        success: false,
        error: {
          type: 'marqeta',
          error,
          status: resp?.response?.status,
          marqetaStatus: resp?.payload?.status,
        },
      }
    }
    const success = (resp?.payload?.status || resp?.response?.status) < 400
    return { success, businesses: resp.payload }
  }
}
