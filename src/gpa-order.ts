import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface GpaOrder {
  tags?: string;
  memo?: string;
  fees?: string[];
  token?: string;
  userToken?: string;
  businessToken?: string;
  amount: number;
  currencyCode: string;
  fundingSourceToken: string;
  fundingSourceAddressToken?: string;
}

export class GpaOrderApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
