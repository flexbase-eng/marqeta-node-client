'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

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
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Personal {
  firstName?: string;
  lastName?: string;
  home?: Address;
}

export interface BeneficialOwner {
  title?: string;
  dob?: string;
  ssn?: string;
  phone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  home?: Address
}

export interface Business {
  token?: string,
  active?: string,
  metadata?: any,
  accountHolderGroupToken?: string,
  createdTime?: string,
  lastModifiedTime?: string,
  status?: string,
  businessNameLegal?: string;
  businessNameDba?: string;
  incorporation?: IncorporationType;
  proprietorOrOfficer?: Personal;
  identifications?: BusinessIdentifications[];
  beneficialOwner1?: BeneficialOwner;
  beneficialOwner2?: BeneficialOwner;
  beneficialOwner3?: BeneficialOwner;
  beneficialOwner4?: BeneficialOwner;
  attestorName?: string;
  attestationConsent?: boolean;
  attestationDate?: string;
  dateEstablished?: string;
}

export interface BusinessList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: Business[];
}

export class BusinessApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a series of list arguments, most of which are optional,
   * as input, pass those to Marqeta, and have them return a *paged* list of
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
    const resp = await this.client.fire('GET',
      'businesses',
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
    return { success: !resp?.payload?.errorCode, businesses: { ...resp.payload } }
  }

  /*
   * Function to take the attributes of a new Business account, create that
   * in Marqeta, and return the account information. If no attributes are
   * provided, a new Business account will still be created and its
   * token ID returned.
   */
  async create(business: Partial<Business>): Promise<{
    success: boolean,
    business?: Business,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'businesses',
      {},
      { ...business })
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
    return { success: !resp?.payload?.errorCode, business: { ...resp.payload } }
  }

  /*
   * Function to take a Marqeta Business token Id and return the Business
   * for that token Id.
   */
  async retrieve(businessTokenId: string): Promise<{
    success: boolean,
    business?: Business,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `businesses/${businessTokenId}`,
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
    return { success: !resp?.payload?.errorCode, business: { ...resp.payload } }
  }

  /*
   * Function to take some Business attributes and update the Business in
   * Marqeta with these values. The return value will be the updated Business.
   */
  async update(business: Partial<Business>): Promise<{
    success: boolean,
    business?: Business,
    error?: MarqetaError,
  }> {
    /* eslint-disable no-unused-vars */
    const {
      createdTime,
      active,
      lastModifiedTime,
      ...updateOptions
    } = business
    /* eslint-enable no-unused-vars */

    const resp = await this.client.fire('PUT',
      `businesses/${business?.token}`,
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
    return { success: !resp?.payload?.errorCode, business: { ...resp.payload } }
  }
}
