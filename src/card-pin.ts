'use strict'

import { Marqeta, MarqetaError, MarqetaOptions } from './index'

export interface CardPin {
  cardToken: string;
  cardTokenType?: string;
}

export class CardPinApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a Card token Id, an optional Control Token type, send
   * those to Marqeta, and have them create and return a Card PIN.
   */
  async create(card: Partial<CardPin>): Promise<{
    success: boolean,
    cardPin?: CardPin,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'pins/controltoken',
      undefined,
      card,
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
    return { success: !resp?.payload?.errorCode, cardPin: { ...resp.payload } }
  }
}
