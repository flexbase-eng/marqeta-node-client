'use strict'

import type {
  Marqeta,
  MarqetaOptions,
} from './'

import {
  AddressType,
  Text,
  Images,
  ImagesCarrier,
  ExpirationOffset,
} from './card'
import {
  MarqetaError,
} from './'

export interface AddressVerification {
  avMessages?:{
    validate?: boolean;
    declineOnAddressNumberMismatch?: boolean;
    declineOnPostalCodeMismatch?: boolean;
  };
  authMessages?: {
    validate?: boolean;
    declineOnAddressNumberMismatch?: boolean;
    declineOnPostalCodeMismatch?: boolean;
  };
}

export interface Shipping {
  method?: string;
  returnAddress?: AddressType;
  recipientAddress?: AddressType;
  careOfLine?: string;
}

export interface POI {
  other?: {
    allow?: boolean
    cardPresenceRequired?: boolean;
    cardholderPresenceRequired?: boolean;
    track1DiscretionaryData?: string;
    track2DiscretionaryData?: string;
  };
  ecommerce?: boolean;
  atm?: boolean;
}

export interface CustomerAuthentication {
  scaContactlessTransactionLimit?: number;
  scaContactlessCumulativeAmountLimit?: number;
  scaContactlessTransactionsCountLimit?: bigint;
  scaContactlessTransactionsCurrency?: string;
  scaLvpTransactionLimit?: number;
  scaLvpCumulativeAmountLimit?: number;
  scaLvpTransactionsCountLimit?: bigint;
  scaLvpTransactionsCurrency?: string;
}

export interface Controls {
  acceptedCountriesToken?: string; // 50 char max
  alwaysRequirePin?: boolean;
  alwaysRequireIcc?: boolean;
  allowGpaAuth?: boolean;
  requireCardNotPresentCardSecurityCode?: boolean;
  allowMccGroupAuthorizationControls?: boolean;
  allowFirstPinSetViaFinancialTransaction?: boolean;
  ignoreCardSuspendedState?: boolean;
  allowChipFallback?: boolean;
  allowNetworkLoad?: boolean;
  allowNetworkLoadCardActivation?: boolean;
  allowQuasiCash?: boolean;
  quasiCashExemptMerchantGroupToken?: string // 36 char max
  enablePartialAuthApproval?: boolean;
  addressVerification?: AddressVerification;
  notificationLanguage?: string;
  strongCustomerAuthenticationLimits?: CustomerAuthentication;
  quasiCashExemptMids?: string;
  enableCreditService?: boolean;
}

export interface CardLifeCycle {
  activateUponIssue?: boolean;
  expirationOffset?: {
    unit?: string;
    value?: bigint;
    minOffset?: ExpirationOffset;
  };
  cardServiceCode?: bigint;
  updateExpirationUponActivation?: boolean;
}

export interface Config {
  poi?: POI;
  transactionControls?: Controls;
  selectiveAuth?: {
    saMode?: bigint;
    enableRegexSearchChain?: boolean;
    dmdLocationSensitivity?: bigint;
  };
  special?: {
    merchantOnBoarding?: boolean;
  };
  cardLifeCycle?: CardLifeCycle;
  clearingAndSettlement?: {
    overdraftDestination?: string;
  };
  jitFunding?: {
    paymentcardFundingSource?: {
      enabled?: boolean;
      refundsDestination?: string;
    };
    programgatewayFundingSource: {
      enabled?:boolean;
      fundingSourceToken?: string;
      refundsDestination?: string;
      alwaysFund?: boolean;
    };
    programFundingSource: {
      enabled?:	boolean;
      fundingSourceToken?: string;
      refundsDestination?: string;
    };
  };
  digitalWalletTokenization?: {
    provisioningControls?: {
      manualEntry?: {
        enabled?: boolean;
        addressVerification?: {
          validate?: boolean;
        };
      };
      walletProviderCardOnFile?: {
        enabled?: boolean;
        addressVerification?: {
          validate?: boolean;
        };
      };
      inAppProvisioning?: {
        addressVerification?: {
          validate?: boolean;
        };
      };
    };
    cardArtId?: string
  };
  fulfillment?: {
    shipping?: Shipping;
    cardPersonalization?: {
      text?: Text;
      images?: Images;
      carrier?: ImagesCarrier;
      persoType?: string;
    };
    paymentInstrument?: string;
    packageId?: string;
    allZeroCardSecurityCode?: boolean;
    binPrefix?:string;
    bulkShip?:	boolean;
    panLength?:string;
    fulfillmentProvider?:string;
    allowCardCreation?:	boolean;
    uppercaseNameLines?:	boolean;
    enableOfflinePin?: boolean;
  };
}

export interface CardProduct {
  token?: string;
  name?: string;
  active?: boolean;
  startDate?: string;
  config?: Config
}

export interface CardProductList {
  count?: bigint;
  startIndex?: bigint;
  endIndex?: bigint;
  isMore?: boolean;
  data?: CardProduct[];
}

export class CardProductApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a series search arguments, most of which are optional,
   * as input, pass them to Marqeta, and have them return any Marqeta Card
   * Products that fit the criteria. If no search arguments are given, this
   * returns *all* the Card Products in Marqeta.
   */
  async list(options: {
    count?: number,
    startIndex?: number,
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    cardProducts?: CardProductList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'cardproducts',
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
    return { success: !resp?.payload?.errorCode, cardProducts: { ...resp.payload } }
  }

  /*
   * Function to take a Card Product token Id, send that to Marqeta, and have
   * them return the Card Product for that token Id.
   */
  async retrieve(tokenId: string):Promise<{
    success?: boolean,
    cardProduct?: CardProduct,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      `cardproducts/${tokenId}`,
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
    return { success: !resp?.payload?.errorCode, cardProduct: { ...resp.payload } }
  }

  /*
   * Function to take some Card Product attributes and update that Card Product
   * in Marqeta with these values. The return value will be the updated
   * Card Product
   */
  async update(cardProduct: CardProduct): Promise<{
    success?: boolean,
    cardProduct?: CardProduct,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('PUT',
      `cardproducts/${cardProduct?.token}`,
      undefined,
      cardProduct,
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
    return { success: !resp?.payload?.errorCode, cardProduct: { ...resp.payload } }
  }

  /*
   * Function to take the attributes of a new Card Product, create that
   * in Marqeta, and return the Card Product information.
   */
  async create(cardProduct: Partial<CardProduct>): Promise<{
    success?: boolean,
    cardProduct?: CardProduct,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('POST',
      'cardproducts',
      undefined,
      cardProduct)
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
    return { success: !resp?.payload?.errorCode, cardProduct: { ...resp.payload } }
  }
}
