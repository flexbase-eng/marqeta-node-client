'use strict'

import type {
  Marqeta, MarqetaError,
  MarqetaOptions,
} from './'

export interface VelocityControl {
  token?: string;
  name?: string;
  association?: {
    userToken?: string;
    businessToken?: string;
  }
  merchantScope: {
    mid?: string;
    mcc?: string;
    mcc_group?: string;
  }
  usageLimit?: number;
  approvalsOnly?: boolean;
  includePurchases?: boolean;
  includeWithdrawals?: boolean;
  includeTransfers?: boolean;
  includeCashback?: boolean;
  includeCredits?: boolean;
  currencyCode: string;
  amountLimit: number;
  velocityWindow: string;
  active?: boolean;
}

export class VelocityControlApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a Velocity Control argument, send that to Marqeta, and
   * have a Velocity Control created and returned to the caller.
   */
  async create(control: Partial<VelocityControl>): Promise<{
    success: boolean,
    body?: VelocityControl,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'velocitycontrols',
      undefined,
      { ...control },
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
    return { success: !resp?.payload?.errorCode, body: { ...resp.payload } }
  }
}
