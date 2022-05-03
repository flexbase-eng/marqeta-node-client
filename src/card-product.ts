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

export interface POI {
  other: {
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
  acceptedCountriesToken?: string; //50 char max
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
    minOffset?: {
      unit?: string;
      value?: bigint;
    };
  };
  cardServiceCode?: bigint;
  updateExpirationUponActivation?: boolean;
}

export interface Config {
  poi?: POI;
  transactionControls?: Controls;
  selectiveAuth?: {
    saMode: bigint;
    enableRegexSearchChain: boolean;
    dmdLocationSensitivity: bigint;
  };
  special?: {
    merchantOnBoarding?: boolean;
  };
  cardLifeCycle?: CardLifeCycle;
  clearingAndSettlement?: {
    overdraftDestination: string;
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
    provisioning_controls?: {
      manual_entry?: {
        enabled?: boolean;
        address_verification?: {
          validate: boolean;
        };
      };
      wallet_provider_card_on_file?: {
        enabled?: boolean;
        address_verification?: {
          validate: boolean;
        };
      };
      in_app_provisioning?: {
        address_verification?: {
          validate?: boolean;
        };
      };
    };
    card_art_id?: string
  };
  fulfillment?: {
    shipping?: Shipping;
    card_personalization?: {
      text?: Text;
      images?: Images;
      carrier?: Carrier;
      perso_type?: string;
    };
    payment_instrument?: string;
    package_id?: string;
    all_zero_card_security_code?: boolean;
    bin_prefix?:string;
    bulk_ship?:	boolean;
    pan_length?:string;
    fulfillment_provider?:string;
    allow_card_creation?:	boolean;
    uppercase_name_lines?:	boolean;
    enable_offline_pin?: boolean;
  };
}

export interface Card {
  token?: string;
  name: string;
  active?: boolean;
  startDate: string;
  endDate: string;
  config?: Config
}

export class CardProductApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

}
