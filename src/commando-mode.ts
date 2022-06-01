import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface CommandoMode {
  count?: bigint;
  startIndex?: bigint;
  sortBy?: string,
}

export class CommandoModeApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
