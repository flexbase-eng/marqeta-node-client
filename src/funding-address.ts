'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface FundingAddress {
  userToken?:	string;
  businessToken?:	string;
  token?: string;
  firstName:	string;
  lastName:	string;
  address1:	string;
  address2?:	string;
  city:	string;
  state:	string;
  zip?:	string;
  country:	string;
  phone?:	string;
  isDefaultAddress?:	boolean;
  active?:	boolean;
  postalCode?: string;
}

export class FundingAddressApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
