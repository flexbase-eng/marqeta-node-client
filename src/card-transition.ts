'use strict'

import type {
  Marqeta,
  MarqetaOptions,
  MarqetaError,
} from './'

export interface CardTransition {
  cardToken: string;
  state: string;
  channel: string;
  token?: string;
  reason?: string;
  reasonCode?: string;
  validations?: {
    user?: {
      birthDate?: string;
      phone?: string;
      ssn?: string;
      randomNameLine1Postfix?: string;
    }
  }
}

export class CardTransitionApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take the attributes of a Card Transition, create that in
   * Marqeta, and return the Card Transition information, where the 'cardToken',
   * 'channel', and 'state' are required, while the remaining attributes are
   * optional.
   */
  async create(transition: Partial<CardTransition>): Promise<{
    success: boolean,
    cardTransition?: CardTransition,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'cardtransitions',
      undefined,
      transition,
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
    return {
      success: !resp?.payload?.errorCode,
      cardTransition: { ...resp.payload },
    }
  }
}
