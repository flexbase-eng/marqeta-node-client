'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'
import { MarqetaError } from './'

export interface ExpirationOffset {
  unit?: string;
  value?: bigint;
}

export interface AddressType {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address1: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  postalCode?: string;
}

export interface Shipping {
  method?: string;
  returnAddress?: AddressType;
  recipientAddress?: AddressType;
  careOfLine?: string;
}

export interface Text {
  nameLine1: {
    value: string;
  };
  nameLine2?: {
    value: string;
  };
  nameLine3?: {
    value: string;
  };
}

export interface ImagesCarrier {
  name?: string;
  message1?: string;
}

export interface Images {
  card?: {
    name?: string;
    thermalColor?: string;
  };
  carrier?: ImagesCarrier;
  signature?: {
    name: string;
  };
  carrierReturnWindow?: {
    name: string;
  };
}

export interface Carrier {
  templateId?: string;
  logoFile?: string;
  logoThumbnailFile?: string;
  messageFile?: string;
  messageLine?: string;
}

export interface CardPersonalization {
  text: Text;
  images?: Images;
  carrier?: Carrier;
  persoType?: string;
}

export interface Fulfillment {
  shipping?: Shipping;
  cardPersonalization?: CardPersonalization;
}

export interface ActivationActions {
  terminateReissuedSourceCard?: boolean;
  swapDigitalWalletTokensFromCardToken?: string;
}

export interface Card {
  cardProductToken: string;
  metadata?: any;
  expiration?: string;
  expirationTime?: string;
  expirationOffset?: ExpirationOffset;
  token?: string;
  userToken: string;
  fulfillment?: Fulfillment;
  reissuePanFromCardToken?: string;
  newPanFromCardToken?: string;
  translatePinFromCardToken?: string;
  activationActions?: ActivationActions;
  barcode?: string;
  bulkIssuanceToken?: string;
  chipCvvNumber?: string;
  contactlessExemptionCounter?: bigint;
  contactlessExemptionTotalAmount?: number;
  cvvNumber?: string;
  expedite?: boolean;
}

export interface CardList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data?: Card[];
}

export class CardApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take the attributes of a new Card, create that
   * in Marqeta, and return the Card information.
   */
  async create(card: Partial<Card>): Promise<{
    success: boolean,
    card?: Card,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'cards',
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
    return { success: !resp?.payload?.errorCode, card: { ...resp.payload } }
  }

  /*
   * Function to take a User token, and a series of search arguments - most of
   * which are optional- as input, pass them to Marqeta, and have them return
   * any Marqeta Cards that fit the criteria for the given User token. If no
   * search arguments are given, this returns *all* the Cards in Marqeta for
   * the Card associated with the token.
   */
  async listByUser(token: string, options: {
    count?: number,
    startIndex?: number,
    fields?: string[],
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    cards?: CardList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `cards/user/${token}`,
      options
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
    return { success: !resp?.payload?.errorCode, cards: { ...resp.payload } }
  }

  /*
   * Function to take a Card barcode, pass it to Marqeta, and have them return
   * the Marqeta Card associated with that barcode.
   */
  async byBarcode(barcode: string): Promise<{
    success: boolean,
    card?: Card,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `cards/barcode/${barcode}`,
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
    return { success: !resp?.payload?.errorCode, card: { ...resp.payload } }
  }

  /*
   * Function to take some Card attributes and update the Card in Marqeta
   * with these values. The return value will be the updated Card.
   */
  async update(token: string, options: {
    metadata?: any,
    expedite?: boolean,
    fulfillment?: Fulfillment,
    token?: string,
    userToken?: string,
  }): Promise<{
    success: boolean,
    card?: Card,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('PUT',
      `cards/${token}`,
      undefined,
      options
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
    return { success: !resp?.payload?.errorCode, card: { ...resp.payload } }
  }

  /*
   * Function to take a Marqeta Card token Id, send that to Marqeta, and have
   * them return the Business information for that token Id.
   */
  async retrieve(token: string): Promise<{
    success: boolean,
    card?: Card,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `cards/${token}`,
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
    return { success: !resp?.payload?.errorCode, card: { ...resp.payload } }
  }
}
