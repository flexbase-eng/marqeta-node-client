'use strict'

import { Marqeta, MarqetaOptions } from './index'

export interface autoReload {
  token: string;
  active: boolean;
  currencyCode: string;
  association: {
    userToken: string;
  };
  fundingSourceToken: string;
  orderScope: {
    gpa: {
      triggerAmount: number;
      reloadAmount: number;
    };
  };
  createdTime: string;
  lastModifiedTime: string;
}

export class AutoReloadApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
