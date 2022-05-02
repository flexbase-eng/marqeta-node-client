'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

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
  carOfLine?: string;
}

export interface NameLineType {
  [value: string]: string;
}

export interface Text {
  nameLine1: NameLineType;
  nameLine2?: NameLineType
  nameLine3?: NameLineType
}

export interface Card {
  name?: string
  thermalColor?: string;
}

export interface ImagesCarrier {
  name?: string
  message1?: string;
}

export interface NameType {
  name?: string
}

export interface Images {
  card?: Card;
  carrier?: ImagesCarrier;
  signature?: NameType;
  carrierReturnWindow?: NameType;
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
  cardPersonalization: CardPersonalization;
}

export interface ActivationActions {
  terminateReissuedSourceCard?: boolean;
  swapDigitalWalletTokensFromCardToken?: string;
}

export interface CardType {
  cardProductToken: string;
  expedite?: boolean;
  metadata?: any;
  expirationOffset?: ExpirationOffset;
  token?: string;
  userToken: string;
  fulfillment?: Fulfillment;
  reissuePanFromCardToken?: string;
  newPanFromCardToken?:string;
  translatePinFromCardToken?: string;
  activationActions?: ActivationActions;
  bulkIssuanceToken?: string;
}

export class CardApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

}