'use strict'

import { Marqeta, MarqetaError, MarqetaOptions } from './index'

export interface CardPin {
  cardToken?: string;
  cardTokenType?: string;
  controlToken?: string;
  controltokenType?: string;
  cardholderVerificationMethod?: string;
  pin?: string;
}

export class CardPinApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a Card token Id, an optional Control Token type, send
   * those to Marqeta, and have them create and return a Control Token which is
   * required when creating or updating a Card PIN.
   */
  async createControlToken(cardPin: Partial<CardPin>): Promise<{
    success: boolean,
    cardPin?: CardPin,
    error?: MarqetaError,
  }> {
    const {
      cardToken,
      cardTokenType,
    } = cardPin
    const resp = await this.client.fire('POST',
      'pins/controltoken',
      undefined,
      { cardToken, cardTokenType }
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

  /*
   * Function to take a Card PIN and Control Token and create, send those to
   * Marqeta, and have the PIN updated or created for the CARD.
   */
  async upsert(cardPin: Partial<CardPin>): Promise<{
    success: boolean,
    error?: MarqetaError,
  }> {
    const {
      controlToken,
      pin,
    } = cardPin
    const resp = await this.client.fire('PUT',
      'pins',
      undefined,
      { controlToken, pin }
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
    return { success: !resp?.payload?.errorCode }
  }

  /*
   * Function to take a required Card PIN Control Token and Cardholder
   * Verification Method, send those to Marqeta, and have the PIN revealed for
   * an existing, active card.
   */
  async revealPin(cardPin: Partial<CardPin>): Promise<{
    success: boolean,
    error?: MarqetaError,
  }> {
    const {
      controlToken,
      cardholderVerificationMethod,
    } = cardPin
    const resp = await this.client.fire('POST',
      'pins/reveal',
      undefined,
      { controlToken, cardholderVerificationMethod }
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
    return { success: !resp?.payload?.errorCode }
  }
}
