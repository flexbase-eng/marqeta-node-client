import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface AcceptedCountries {
  count?: bigint;
  startIndex?: bigint;
  name?: string;
  whitelist?: boolean;
  searchType?: string;
  fields?: string[];
  sortBy?: string,
}

export class AcceptedCountriesApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
