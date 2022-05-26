'use strict'

import { Marqeta, MarqetaOptions } from './index'

export class ProgramReserveApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
