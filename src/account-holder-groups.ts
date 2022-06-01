'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

export interface FundingProgram {
  token?: string;
  name?: string;
  config?: {
    kycRequired?: string;
    isReloadable?: boolean;
    realTimeFeeGroupToken?: string;
    preKycControls?: {
      cashAccessEnabled?: boolean;
      internationalEnabled?:	boolean;
      balanceMax?: number;
      enableNonProgramLoads?: boolean;
      isReloadablePreKyc?: boolean;
    }
  };
  createdTime?: string;
  lastModifiedTime?: string;
}

export class AccountHolderGroupsApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }
}
