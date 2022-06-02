# marqeta-node-client
`marqeta-node-client` is a Node/JS and TypeScript Client for 
[Marqeta](https://www.marqeta.com/) that allows you to use normal Node
syntax to Users, Businesses, Cards, Transactions and other data from the Marqeta 
[API](https://www.marqeta.com/docs/core-api/introduction)

## Install

```bash
# with npm
$ npm install marqeta-node-client
```

## usage

This readme isn't going to cover all the specifics of what Marqeta is,
and how to use it - it's targeted as a _companion_ to the Marqeta developer
[docs](https://www.marqeta.com/docs/developer-guides)
that explain each of the endpoints and how the general Marqeta
[API](https://www.marqeta.com/docs/core-api/introduction) works.


### Getting your API Key

Create an [account](https://www.marqeta.com/users/sign_up) on the Marqeta 
platform. As part of creating your account on [app.marqeta.com](https://app.marqeta.com/development), 
you will also create a [sandbox](https://www.marqeta.com/docs/developer-guides/core-api-quick-start#_create_a_sandbox) 
and a user. After you have created your account and signed in, you are 
ready to create the [sandbox](https://www.marqeta.com/docs/developer-guides/core-api-quick-start#_create_a_sandbox) 
where you can simulate transactions on the Marqeta platform. After creating 
your sandbox, you will receive an email when your sandbox is ready. The 
sandbox creation page refreshes to display your [Dashboard](https://app.marqeta.com/development). 
Your personal API keys and a cURL to try out the sandbox are provided here.

### Creating the Client

All Marqeta functions are available from the client, and the basic
construction of the client is:

```typescript
import { Marqeta } from 'marqeta-node-client'
const client = new Marqeta({
  host: 'sandbox-api.marqeta.com/v3',  
  apiAppToken: '705b5bc0-c4d3-11ec-9d64-0242ac120002',
  apiAccessToken: 'abbykj26-z8a1-21ea-8c64-92d6ac1a0002'
})
```

### User Account Calls
[documentation](https://www.marqeta.com/docs/core-api/users)

> The user resource represents a person who accesses Marqeta-administered 
> funds via a Marqeta card (whether physical or virtual). This endpoint 
> enables you to create and manage users on the Marqeta platform.

#### [Create User Account](https://www.marqeta.com/docs/core-api/users#postUsers)

You can create a Marqeta User with a single call:

```typescript
const resp = await client.user.create({
    token: '',
    firstName: 'Ipsumi4',
    lastName: 'Lorem',
    email: `ipsum.lorem@mailinator.com`,
    address1: '100 Main Street',
    city: 'Canton',
    state: 'GA',
    postalCode: '30114-7531',
    country: 'US',
    birthDate: '1974-01-15',
    phone: '555-867-5309'
  })
```

and the response will look something like this:

```javascript
{
  success: true,
  user: {
    token: '3b8dbcbb-48da-45fd-95a4-0f8ff9109499',
    active: true,
    firstName: 'Ipsumi4',
    lastName: 'Lorem',
    email: 'ipsum.lorem58@mailinator.com',
    address1: '100 Main Street',
    city: 'Canton',
    state: 'GA',
    postalCode: '30114-7531',
    country: 'US',
    birthDate: '1974-01-15',
    phone: '555-867-5309',
    usesParentAccount: false,
    corporateCardHolder: false,
    createdTime: '2022-06-01T20:23:56Z',
    lastModifiedTime: '2022-06-01T20:23:56Z',
    metadata: {},
    accountHolderGroupToken: 'DEFAULT_AHG',
    status: 'ACTIVE'
  }
}
```

If there had been an error, the response would be:

```javascript
{
  success: false,
  error: {
    type: 'marqeta',
    error: 'A card holder with the same email already exist',
    status: '400057'
  }
}
```

where:

* `status` is the HTTP response status from the call **_to_** Marqeta from
  your process.

So looking at the `success` value of the response will quickly let you know the outcome of the call.

#### [Retrieve User](https://www.marqeta.com/docs/core-api/users#getUsersToken)

You can get a User by token id using the retrieve endpoint:

```typescript
const resp = await client.user.retrieve(
   '3b8dbcbb-48da-45fd-95a4-0f8ff9109499',
)
```

and the output will look something like this:

```javascript
{
  success: true,
  user: {
    token: '8650c2c0-91d3-4d0b-a316-a6d71b02b3eb',
    active: false,
    firstName: 'Ipsumi425',
    lastName: 'Lorem',
    email: 'ipsum.lorem45@mailinator.com',
    address1: '100 Main Street',
    city: 'Canton',
    state: 'GA',
    postalCode: '30114-7531',
    country: 'US',
    birthDate: '1974-01-15',
    phone: '555-867-5309',
    usesParentAccount: false,
    corporateCardHolder: false,
    createdTime: '2022-06-01T20:53:13Z',
    lastModifiedTime: '2022-06-01T21:09:45Z',
    metadata: {},
    accountHolderGroupToken: 'DEFAULT_AHG',
    status: 'UNVERIFIED'
  }
}
```

and if the user is not found, the response would be:

```javascript
{
  success: false,
  error: { 
    type: 'marqeta', 
    error: 'Cardholder not found', 
    status: '404004' 
  }
}
```

#### [Update Users](https://www.marqeta.com/docs/core-api/users#putUsersToken)

An update to a User would look like this:

```typescript
const resp = await client.user.update({
  token: '8650c2c0-91d3-4d0b-a316-a6d71b02b3eb',
  firstName: 'Voluptate',
  lastName: 'Lorem',
  email: `voluptate.lorem@mailinator.com`,
  address1: '100 Main Street',
  city: 'Canton',
  state: 'GA',
  postalCode: '30114-7531',
  country: 'US',
  birthDate: '1974-01-15',
  phone: '555-867-5309'
})
```

#### [List Users](https://www.marqeta.com/docs/core-api/users#getUsers)

You can get a list of all Marqeta Users with no arguments:

```typescript
const resp = await client.user.list()
```

or you can add in filtering criteria like the `count` or the `createdTime`:

```typescript
const resp = await client.user.list({
  count: 1,
  sortBy: 'createdTime',
})
```

and the result will look something like this:

```javascript
{
  "success": true,
  "userList": {
    "count": 2,
    "startIndex": 0,
    "endIndex": 1,
    "isMore": true,
    "data": [
      {
        "token": "6c432f59-26ec-48a7-b1f8-5da4c2e8efc1",
        "active": true,
        "firstName": "Ipsumi447",
        "lastName": "Lorem",
        "email": "ipsum.lorem86@mailinator.com",
        "address1": "100 Main Street",
        "city": "Canton",
        "state": "GA",
        "postalCode": "30114-7531",
        "country": "US",
        "birthDate": "1974-01-15",
        "phone": "555-867-5309",
        "usesParentAccount": false,
        "corporateCardHolder": false,
        "createdTime": "2022-06-01T21:09:45Z",
        "lastModifiedTime": "2022-06-01T21:39:14Z",
        "metadata": { },
        "accountHolderGroupToken": "DEFAULT_AHG",
        "status": "ACTIVE"
      },
      {
        "token": "8650c2c0-91d3-4d0b-a316-a6d71b02b3eb",
        "active": false,
        "firstName": "Ipsumi42513",
        "lastName": "Lorem",
        "email": "ipsum.lorem45@mailinator.com",
        "address1": "100 Main Street",
        "city": "Canton",
        "state": "GA",
        "postalCode": "30114-7531",
        "country": "US",
        "birthDate": "1974-01-15",
        "phone": "555-867-5309",
        "usesParentAccount": false,
        "corporateCardHolder": false,
        "createdTime": "2022-06-01T20:53:13Z",
        "lastModifiedTime": "2022-06-01T21:23:53Z",
        "metadata": { },
        "accountHolderGroupToken": "DEFAULT_AHG",
        "status": "UNVERIFIED"
      }
    ]
  }
}
```

### Business Account Calls
[documentation](https://www.marqeta.com/docs/core-api/businesses)

> A business is a type of account holder that cannot directly 
> hold cards, but can have a parent/child relationships with 
> card-holding users. A business can monitor and control card 
> use by a specified group of users. 

#### [Create Business Account](https://www.marqeta.com/docs/core-api/businesses#postBusinesses)

You can create a Marqeta Business with a single call:

```typescript
const resp = await client.business.create({
  businessNameLegal: 'AcmeZinc INC',
  businessNameDba: 'zinc inc',
  incorporation: {
    stateOfIncorporation: 'LA',
    incorporationType: 'CORPORATION'
  },
  proprietorOrOfficer: {
    firstName: '',
    lastName: '',
    home: {
      address1: '106 Main St.',
      address2: '',
      city: 'Opelousas',
      state: 'LA',
      postalCode: '70570',
      country: 'USA'
    }
  },
  identifications: [
    {
      type: 'BUSINESS_TAX_ID',
      value: '901721634'
    }
  ],
})
```

and the response will be something like this:

```javascript
{
  success: true,
  business: {
    token: '5984ac26-f653-437a-93f3-d6cef36c8fc1',
    active: true,
    accountHolderGroupToken: 'DEFAULT_AHG',
    createdTime: '2022-06-02T12:49:19Z',
    lastModifiedTime: '2022-06-02T12:49:19Z',
    status: 'ACTIVE',
    businessNameLegal: 'AcmeZinc INC',
    businessNameDba: 'zinc inc',
    incorporation: { stateOfIncorporation: 'LA', incorporationType: 'CORPORATION' },
    proprietorOrOfficer: { home: [Object] },
    identifications: [ [Object] ]
  }
}
```

and if there was an error, the response would be something like this:

```javascript
{
  success: false,
  error: {
    type: 'marqeta',
    error: "Malformed JSON request received: Can not construct instance of com.marqeta.mqpay.api.v3.enums.IdentificationType from String value 'BINESS_TAX_ID': value not one of declared Enum instance names: [NIN, PASSPORT_NUMBER, BUSINESS_NUMBER, TIN, DRIVERS_LICENSE, BUSINESS_TAX_ID, TAXPAYER_REFERENCE, SIN, SSN] at line: 1 column: 304",
    status: '400037'
  }
}
```

#### [Update Business Account](https://www.marqeta.com/docs/core-api/businesses#putBusinessesToken)

A call to update a Marqeta Business would look something like this:

```typescript
const resp = await client.business.update({
  businessNameLegal: 'AcmeZinc INC',
  businessNameDba: 'zinc inc',
  incorporation: {
    stateOfIncorporation: 'LA',
    incorporationType: 'CORPORATION'
  },
  proprietorOrOfficer: {
    firstName: '',
    lastName: '',
    home: {
      address1: '106 Main St.',
      address2: '',
      city: 'Opelousas',
      state: 'LA',
      postalCode: '70570',
      country: 'USA'
    }
  },
  identifications: [{
     type: 'BUSINESS_TAX_ID',
     value: '901721634'
  }],
})
```

and the response would look like this:

```javascript
{
  "success": true,
  "business": {
    "token": "a19807e9-501d-4162-8741-099b8fa75bc7",
    "active": true,
    "metadata": { },
    "accountHolderGroupToken": "DEFAULT_AHG",
    "createdTime": "2022-06-02T14:02:26Z",
    "lastModifiedTime": "2022-06-02T14:02:26Z",
    "status": "ACTIVE",
    "businessNameLegal": "AcmeZinc INC68",
    "businessNameDba": "zinc inc",
    "incorporation": {
      "stateOfIncorporation": "LA",
      "incorporationType": "CORPORATION"
    },
    "proprietorOrOfficer": {
      "home": {
        "address1": "106 Main St.",
        "city": "Opelousas",
        "state": "LA",
        "postalCode": "70570",
        "country": "USA"
      }
    },
    "identifications": [
      {
        "type": "BUSINESS_TAX_ID",
        "value": "901721634"
      }
    ]
  }
}
```

#### [List Business Accounts](https://www.marqeta.com/docs/core-api/businesses#getBusinesses)

And, you can get a list of Marqeta Business Accounts with a call like this:

```typescript
const resp = await client.business.list()
```

But you can also include several filtering criteria, like:

```typescript
const resp = await client.business.list({ 
  count: 2,
  sortBy: 'lastModifiedTime',
})
```

and the response would look something like this:

```javascript
{
  "success": true,
  "businesses": {
    "count": 2,
    "startIndex": 0,
    "endIndex": 1,
    "isMore": true,
    "data": [
      {
        "token": "244728d8-2f9b-4972-86fa-c7818fa7ade5",
        "active": true,
        "metadata": { },
        "accountHolderGroupToken": "DEFAULT_AHG",
        "createdTime": "2022-06-02T14:10:29Z",
        "lastModifiedTime": "2022-06-02T14:10:29Z",
        "status": "ACTIVE",
        "businessNameLegal": "AcmeZinc INC",
        "businessNameDba": "zinc inc",
        "incorporation": {
          "stateOfIncorporation": "LA",
          "incorporationType": "CORPORATION"
        },
        "proprietorOrOfficer": {
          "home": {
            "address1": "106 Main St.",
            "city": "Opelousas",
            "state": "LA",
            "postalCode": "70570",
            "country": "USA"
          }
        },
        "identifications": [
          {
            "type": "BUSINESS_TAX_ID",
            "value": "901721634"
          }
        ]
      },
      {
        "token": "a19807e9-501d-4162-8741-099b8fa75bc7",
        "active": true,
        "metadata": { },
        "accountHolderGroupToken": "DEFAULT_AHG",
        "createdTime": "2022-06-02T14:02:26Z",
        "lastModifiedTime": "2022-06-02T14:02:26Z",
        "status": "ACTIVE",
        "businessNameLegal": "AcmeZinc INC68",
        "businessNameDba": "zinc inc",
        "incorporation": {
          "stateOfIncorporation": "LA",
          "incorporationType": "CORPORATION"
        },
        "proprietorOrOfficer": {
          "home": {
            "address1": "106 Main St.",
            "city": "Opelousas",
            "state": "LA",
            "postalCode": "70570",
            "country": "USA"
          }
        },
        "identifications": [
          {
            "type": "BUSINESS_TAX_ID",
            "value": "901721634"
          }
        ]
      }
    ]
  }
}
```

### Card Account Calls
[documentation](https://www.marqeta.com/docs/core-api/cards)

> The card resource represents a payment card. Cards are derived 
> from and controlled by the card-product resource.

#### [Create Card](https://www.marqeta.com/docs/core-api/cards#postCards)

You can create a Marqeta Card with a single call:

```typescript
const resp = client.card.create({
  userToken: '09d921f5-5a0b-4a31-b76a-603bb12b1329',
  cardProductToken: 'eca757c9-a04e-4966-b102-1403900c7b82',
})
```

and the response will look something like this:

```javascript
{
  "success": true,
  "card": {
    "createdTime": "2022-06-02T15:23:19Z",
    "lastModifiedTime": "2022-06-02T15:23:19Z",
    "token": "bba520f8-cfd6-48da-a1f0-485b0c4b1641",
    "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
    "cardProductToken": "eca757c9-a04e-4966-b102-1403900c7b82",
    "lastFour": "0821",
    "pan": "111111______0821",
    "expiration": "0626",
    "expirationTime": "2026-06-30T23:59:59Z",
    "barcode": "15355409295917906161",
    "pinIsSet": false,
    "state": "UNACTIVATED",
    "stateReason": "New card",
    "fulfillmentStatus": "ISSUED",
    "instrumentType": "PHYSICAL_MSR",
    "expedite": false,
    "metadata": { }
  }
}
```

#### [Retrieve Card by barcode](https://www.marqeta.com/docs/core-api/cards#getCardsBarcodeBarcode)

To retrieve a Marqeta Card by barcode, use this call:

```typescript
const resp = await client.card.byBarcode(
  '15355409295917906161',
)
```

and the response will be something like this:

```javascript
{
  "success": true,
  "card": {
    "createdTime": "2022-06-02T15:23:19Z",
    "lastModifiedTime": "2022-06-02T15:23:19Z",
    "token": "bba520f8-cfd6-48da-a1f0-485b0c4b1641",
    "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
    "cardProductToken": "eca757c9-a04e-4966-b102-1403900c7b82",
    "lastFour": "0821",
    "pan": "111111______0821",
    "expiration": "0626",
    "expirationTime": "2026-06-30T23:59:59Z",
    "barcode": "15355409295917906161",
    "pinIsSet": false,
    "state": "UNACTIVATED",
    "stateReason": "New card",
    "fulfillmentStatus": "ISSUED",
    "instrumentType": "PHYSICAL_MSR",
    "expedite": false,
    "metadata": {}
  }
}
```

#### [Update Card](https://www.marqeta.com/docs/core-api/cards#putCardsToken)

To update a Marqeta Card, use this call:

```typescript
const resp = await client.card.update(
  'bba520f8-cfd6-48da-a1f0-485b0c4b1641',
  { metadata: { name_1: 'ipsum' } },
)
```

where the first argument is the Card token Id, and the second 
is the data to update, and the response will be something 
like this:

```javascript
{
  "success": true,
  "card": {
    "createdTime": "2022-06-02T15:39:42Z",
    "lastModifiedTime": "2022-06-02T15:39:42Z",
    "token": "eed809f3-b34c-4c04-9ad2-b540e684ed87",
    "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
    "cardProductToken": "eca757c9-a04e-4966-b102-1403900c7b82",
    "lastFour": "7574",
    "pan": "111111______7574",
    "expiration": "0626",
    "expirationTime": "2026-06-30T23:59:59Z",
    "barcode": "37670272753733965645",
    "pinIsSet": false,
    "state": "UNACTIVATED",
    "stateReason": "New card",
    "fulfillmentStatus": "ISSUED",
    "instrumentType": "PHYSICAL_MSR",
    "expedite": false,
    "metadata": {
      "name1": "ipsum"
    }
  }
}
```

#### [List Cards by User](https://www.marqeta.com/docs/core-api/cards#getCardsUserToken)

To get a list of cards, the call would look like this:

```typescript
const resp = await client.card.listByUser({ 
  '09d921f5-5a0b-4a31-b76a-603bb12b1329',
  { count: 1, },
})
```

where the first argument is the User token, the second being 
optional filter fields, and the response would be something 
like this:

```javascript
{
  "success": true,
  "cards": {
    "count": 1,
    "startIndex": 0,
    "endIndex": 0,
    "isMore": false,
    "data": [
      {
        "createdTime": "2022-06-02T15:23:19Z",
        "lastModifiedTime": "2022-06-02T15:23:19Z",
        "token": "bba520f8-cfd6-48da-a1f0-485b0c4b1641",
        "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
        "cardProductToken": "eca757c9-a04e-4966-b102-1403900c7b82",
        "lastFour": "0821",
        "pan": "111111______0821",
        "expiration": "0626",
        "expirationTime": "2026-06-30T23:59:59Z",
        "barcode": "15355409295917906161",
        "pinIsSet": false,
        "state": "UNACTIVATED",
        "stateReason": "New card",
        "fulfillmentStatus": "ISSUED",
        "instrumentType": "PHYSICAL_MSR",
        "expedite": false,
        "metadata": {
          "name1": "ipsum"
        }
      }
    ]
  }
}
```

#### [Retrieve Card](https://www.marqeta.com/docs/core-api/cards#getCardsToken)

To retrieve a Marqeta Card by token Id, use this call:

```typescript
const resp = await client.card.retrieve(
   'bba520f8-cfd6-48da-a1f0-485b0c4b1641',
)
```

and the response will be something like this:

```javascript
{
  "success": true,
  "card": {
    "createdTime": "2022-06-02T15:23:19Z",
    "lastModifiedTime": "2022-06-02T15:23:19Z",
    "token": "bba520f8-cfd6-48da-a1f0-485b0c4b1641",
    "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
    "cardProductToken": "eca757c9-a04e-4966-b102-1403900c7b82",
    "lastFour": "0821",
    "pan": "111111______0821",
    "expiration": "0626",
    "expirationTime": "2026-06-30T23:59:59Z",
    "barcode": "15355409295917906161",
    "pinIsSet": false,
    "state": "UNACTIVATED",
    "stateReason": "New card",
    "fulfillmentStatus": "ISSUED",
    "instrumentType": "PHYSICAL_MSR",
    "expedite": false,
    "metadata": {
      "name1": "ipsum"
    }
  }
}
```

### Card Products Calls
[documentation](https://www.marqeta.com/docs/core-api/card-products)

> The card products resource represents the behavior and functionality 
> of one or more cards (either physical or virtual). For example, 
> attributes of the card product determine whether the associated 
> cards can be used at an ATM and/or online and whether they are 
> currently enabled. For physical cards, the card product determines 
> color and other printing specifications for when the cards are 
> manufactured and personalized. You can optionally associate 
> authorization controls and/or velocity controls with card products 
> to restrict where and how associated cards are used.

#### [Create Card Product](https://www.marqeta.com/docs/core-api/card-products#postCardproducts)

You can create a Marqeta Card Product with a single call:

```typescript
const resp = await client.cardProduct.create({
  name: 'Acme Ipsum INC',
  startDate: '2019-08-24T14:15:22Z'
})
```

and if successful, the response would look something like this:

```javascript
{
  "success": true,
   "cardProduct": {
    "token": "118a7f65-eef4-4774-a7c3-6f6c9cbe5f97",
    "name": "Acme Ipsum INC",
    "active": true,
    "startDate": "2019-08-24",
    "config": {
      "poi": {
        "other": {
          "allow": true,
          "cardPresenceRequired": false,
          "cardholderPresenceRequired": false,
          "track1DiscretionaryData": "000000",
          "track2DiscretionaryData": "00000"
        },
        "ecommerce": false,
        "atm": false
      },
      "transactionControls": {
        "acceptedCountriesToken": "accept_us_only",
          "alwaysRequirePin": false,
          "alwaysRequireIcc": false,
          "allowGpaAuth": true,
          "requireCardNotPresentCardSecurityCode": false,
          "allowMccGroupAuthorizationControls": true,
          "allowFirstPinSetViaFinancialTransaction": false,
          "ignoreCardSuspendedState": false,
          "allowChipFallback": true,
          "allowNetworkLoad": false,
          "allowNetworkLoadCardActivation": false,
          "allowQuasiCash": false,
          "enablePartialAuthApproval": true,
          "addressVerification": {
          "avMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": true
          },
          "authMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": false
          }
        },
        "strongCustomerAuthenticationLimits": { },
        "quasiCashExemptMids": "984226812886,000984226812886",
        "enableCreditService": false
      },
      "selectiveAuth": {
        "saMode": 1,
        "enableRegexSearchChain": false,
        "dmdLocationSensitivity": 0
      },
      "special": {
        "merchantOnBoarding": false
      },
      "cardLifeCycle": {
        "activateUponIssue": false,
        "expirationOffset": {
          "unit": "YEARS",
          "value": 4
        },
        "cardServiceCode": 101,
         "updateExpirationUponActivation": false
      },
      "clearingAndSettlement": {
        "overdraftDestination": "GPA"
      },
      "jitFunding": {
        "paymentcardFundingSource": {
          "enabled": false,
          "refundsDestination": ""
        },
        "programgatewayFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": "",
          "alwaysFund": true
        },
        "programFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": ""
        }
      },
      "digitalWalletTokenization": {
        "provisioningControls": {
          "manualEntry": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "walletProviderCardOnFile": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "inAppProvisioning": {
            "enabled": false,
             "addressVerification": {
              "validate": true
            }
          }
        },
        "cardArtId": ""
      },
      "fulfillment": {
        "paymentInstrument": "PHYSICAL_MSR",
        "packageId": "0",
        "allZeroCardSecurityCode": false,
        "binPrefix": "111111",
        "bulkShip": false,
        "panLength": "16",
        "fulfillmentProvider": "PERFECTPLASTIC",
        "allowCardCreation": true,
        "uppercaseNameLines": true,
        "enableOfflinePin": false
      }
    },
    "createdTime": "2022-06-02T18:02:52Z",
    "lastModifiedTime": "2022-06-02T18:02:52Z"
  }
}
```

#### [Update Card Product](https://www.marqeta.com/docs/core-api/card-products#putCardproductsToken)

and to update a Card Product, use this call:

```typescript
const resp = await client.cardProduct.update({
    "token": "118a7f65-eef4-4774-a7c3-6f6c9cbe5f97",
    "name": "Acme Ipsum INC",
    "active": true,
    "startDate": "2019-08-24",
    "config": {
    "poi": {
      "other": {
        "allow": false
      },
      "ecommerce": false,
      "atm": true
    }
    "cardLifeCycle": {
      "activateUponIssue": false,
      "expirationOffset": {
        "unit": "YEARS",
        "value": 4
      },
      "cardServiceCode": 101,
       "updateExpirationUponActivation": false
    },
    "jitFunding": {
      "paymentcardFundingSource": {
        "enabled": false,
         "refundsDestination": ""
      }
    },
    "fulfillment": {
      "paymentInstrument": "PHYSICAL_MSR",
      "packageId": "0",
      "allZeroCardSecurityCode": false,
      "binPrefix": "111111",
      "bulkShip": false,
      "panLength": "16",
      "fulfillmentProvider": "PERFECTPLASTIC",
      "allowCardCreation": true,
      "uppercaseNameLines": true,
      "enableOfflinePin": false
    }
  }
})
```
and the response would be something like this:

```javascript
{
  "success": true,
  "cardProduct": {
    "token": "118a7f65-eef4-4774-a7c3-6f6c9cbe5f97",
    "name": "Acme Ipsum INC100",
    "active": true,
    "startDate": "2019-08-24",
    "config": {
      "poi": {
        "other": {
          "allow": false,
          "cardPresenceRequired": false,
          "cardholderPresenceRequired": false,
          "track1DiscretionaryData": "000000",
          "track2DiscretionaryData": "00000"
        },
        "ecommerce": true,
        "atm": false
      },
      "transactionControls": {
        "acceptedCountriesToken": "accept_us_only",
        "alwaysRequirePin": false,
        "alwaysRequireIcc": false,
        "allowGpaAuth": true,
        "requireCardNotPresentCardSecurityCode": false,
        "allowMccGroupAuthorizationControls": true,
        "allowFirstPinSetViaFinancialTransaction": false,
        "ignoreCardSuspendedState": false,
        "allowChipFallback": true,
        "allowNetworkLoad": false,
        "allowNetworkLoadCardActivation": false,
        "allowQuasiCash": false,
        "enablePartialAuthApproval": true,
        "addressVerification": {
          "avMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": true
          },
          "authMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": false
          }
        },
        "strongCustomerAuthenticationLimits": { },
        "quasiCashExemptMids": "984226812886,000984226812886",
        "enableCreditService": false
      },
      "selectiveAuth": {
        "saMode": 1,
        "enableRegexSearchChain": false,
        "dmdLocationSensitivity": 0
      },
      "special": {
        "merchantOnBoarding": false
      },
      "cardLifeCycle": {
        "activateUponIssue": false,
        "expirationOffset": {
          "unit": "YEARS",
          "value": 4
        },
        "cardServiceCode": 101,
        "updateExpirationUponActivation": false
      },
      "clearingAndSettlement": {
        "overdraftDestination": "GPA"
      },
      "jitFunding": {
        "paymentcardFundingSource": {
          "enabled": false,
          "refundsDestination": ""
        },
        "programgatewayFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": "",
          "alwaysFund": true
        },
        "programFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": ""
        }
      },
      "digitalWalletTokenization": {
        "provisioningControls": {
          "manualEntry": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "walletProviderCardOnFile": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "inAppProvisioning": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          }
        },
        "cardArtId": ""
      },
      "fulfillment": {
        "paymentInstrument": "PHYSICAL_MSR",
        "packageId": "0",
        "allZeroCardSecurityCode": false,
        "binPrefix": "111111",
        "bulkShip": false,
        "panLength": "16",
        "fulfillmentProvider": "PERFECTPLASTIC",
        "allowCardCreation": true,
        "uppercaseNameLines": true,
        "enableOfflinePin": false
      }
    },
    "createdTime": "2022-06-02T18:02:52Z",
    "lastModifiedTime": "2022-06-02T18:02:53Z"
  }
}
```

#### [Retrieve Card Product](https://www.marqeta.com/docs/core-api/card-products#getCardproductsToken)

To retrieve a Card Product, use the Card Product token in this call:

```typescript
const resp = await client.cardProduct.retrieve(
 '118a7f65-eef4-4774-a7c3-6f6c9cbe5f97',
)
```
and the response will look something like this:

```javascript
{
  "success": true,
  "cardProduct": {
    "token": "118a7f65-eef4-4774-a7c3-6f6c9cbe5f97",
    "name": "Acme Ipsum INC",
    "active": true,
    "startDate": "2019-08-24",
    "config": {
      "poi": {
        "other": {
          "allow": true,
          "cardPresenceRequired": false,
          "cardholderPresenceRequired": false,
          "track1DiscretionaryData": "000000",
          "track2DiscretionaryData": "00000"
        },
        "ecommerce": true,
        "atm": false
      },
      "transactionControls": {
        "acceptedCountriesToken": "accept_us_only",
        "alwaysRequirePin": false,
        "alwaysRequireIcc": false,
        "allowGpaAuth": true,
        "requireCardNotPresentCardSecurityCode": false,
        "allowMccGroupAuthorizationControls": true,
        "allowFirstPinSetViaFinancialTransaction": false,
        "ignoreCardSuspendedState": false,
        "allowChipFallback": true,
        "allowNetworkLoad": false,
        "allowNetworkLoadCardActivation": false,
        "allowQuasiCash": false,
        "enablePartialAuthApproval": true,
        "addressVerification": {
          "avMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": true
          },
          "authMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": false
          }
        },
        "strongCustomerAuthenticationLimits": { },
        "quasiCashExemptMids": "984226812886,000984226812886",
        "enableCreditService": false
      },
      "selectiveAuth": {
        "saMode": 1,
        "enableRegexSearchChain": false,
        "dmdLocationSensitivity": 0
      },
      "special": {
        "merchantOnBoarding": false
      },
      "cardLifeCycle": {
        "activateUponIssue": false,
        "expirationOffset": {
          "unit": "YEARS",
          "value": 4
        },
        "cardServiceCode": 101,
        "updateExpirationUponActivation": false
      },
      "clearingAndSettlement": {
        "overdraftDestination": "GPA"
      },
      "jitFunding": {
        "paymentcardFundingSource": {
          "enabled": false,
          "refundsDestination": ""
        },
        "programgatewayFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": "",
          "alwaysFund": true
        },
        "programFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": ""
        }
      },
      "digitalWalletTokenization": {
        "provisioningControls": {
          "manualEntry": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "walletProviderCardOnFile": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "inAppProvisioning": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          }
        },
        "cardArtId": ""
      },
      "fulfillment": {
        "paymentInstrument": "PHYSICAL_MSR",
        "packageId": "0",
        "allZeroCardSecurityCode": false,
        "binPrefix": "111111",
        "bulkShip": false,
        "panLength": "16",
        "fulfillmentProvider": "PERFECTPLASTIC",
        "allowCardCreation": true,
        "uppercaseNameLines": true,
        "enableOfflinePin": false
      }
    },
    "createdTime": "2022-06-02T18:02:52Z",
    "lastModifiedTime": "2022-06-02T18:02:52Z"
  }
}
```

#### [List Card Products](https://www.marqeta.com/docs/core-api/card-products#getCardproducts)

To get a list of Card Products, use this call:

```typescript
const resp = await client.cardProduct.list(
 '118a7f65-eef4-4774-a7c3-6f6c9cbe5f97',
)
```

and the response would look like this:

```javascript
{
  "success": true,
  "cardProduct": {
    "token": "118a7f65-eef4-4774-a7c3-6f6c9cbe5f97",
    "name": "Acme Ipsum INC",
    "active": true,
    "startDate": "2019-08-24",
    "config": {
      "poi": {
        "other": {
          "allow": true,
          "cardPresenceRequired": false,
          "cardholderPresenceRequired": false,
          "track1DiscretionaryData": "000000",
          "track2DiscretionaryData": "00000"
        },
        "ecommerce": true,
        "atm": false
      },
      "transactionControls": {
        "acceptedCountriesToken": "accept_us_only",
        "alwaysRequirePin": false,
        "alwaysRequireIcc": false,
        "allowGpaAuth": true,
        "requireCardNotPresentCardSecurityCode": false,
        "allowMccGroupAuthorizationControls": true,
        "allowFirstPinSetViaFinancialTransaction": false,
        "ignoreCardSuspendedState": false,
        "allowChipFallback": true,
        "allowNetworkLoad": false,
        "allowNetworkLoadCardActivation": false,
        "allowQuasiCash": false,
        "enablePartialAuthApproval": true,
        "addressVerification": {
          "avMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": true
          },
          "authMessages": {
            "validate": true,
            "declineOnAddressNumberMismatch": false,
            "declineOnPostalCodeMismatch": false
          }
        },
        "strongCustomerAuthenticationLimits": { },
        "quasiCashExemptMids": "984226812886,000984226812886",
        "enableCreditService": false
      },
      "selectiveAuth": {
        "saMode": 1,
        "enableRegexSearchChain": false,
        "dmdLocationSensitivity": 0
      },
      "special": {
        "merchantOnBoarding": false
      },
      "cardLifeCycle": {
        "activateUponIssue": false,
        "expirationOffset": {
          "unit": "YEARS",
          "value": 4
        },
        "cardServiceCode": 101,
        "updateExpirationUponActivation": false
      },
      "clearingAndSettlement": {
        "overdraftDestination": "GPA"
      },
      "jitFunding": {
        "paymentcardFundingSource": {
          "enabled": false,
          "refundsDestination": ""
        },
        "programgatewayFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": "",
          "alwaysFund": true
        },
        "programFundingSource": {
          "enabled": false,
          "fundingSourceToken": "",
          "refundsDestination": ""
        }
      },
      "digitalWalletTokenization": {
        "provisioningControls": {
          "manualEntry": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "walletProviderCardOnFile": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          },
          "inAppProvisioning": {
            "enabled": false,
            "addressVerification": {
              "validate": true
            }
          }
        },
        "cardArtId": ""
      },
      "fulfillment": {
        "paymentInstrument": "PHYSICAL_MSR",
        "packageId": "0",
        "allZeroCardSecurityCode": false,
        "binPrefix": "111111",
        "bulkShip": false,
        "panLength": "16",
        "fulfillmentProvider": "PERFECTPLASTIC",
        "allowCardCreation": true,
        "uppercaseNameLines": true,
        "enableOfflinePin": false
      }
    },
    "createdTime": "2022-06-02T18:02:52Z",
    "lastModifiedTime": "2022-06-02T18:02:52Z"
  }
}
```
### Card Transition Calls
[documentation](https://www.marqeta.com/docs/core-api/card-transitions)

> Use the /cardtransitions API to set the state of an existing card.

#### [Create Card Transition](https://www.marqeta.com/docs/core-api/card-transitions#postCardtransitions)

You can change the status an existing Card by using this call: 

```typescript
const resp = await client.userTransition.create({
  status: 'ACTIVE',
  reasonCode: '02',
  channel: 'API',
  userToken: user.token,
})
```

and the response should look something like this:

```javascript
{
  "success": true,
  "cardTransition": {
    "token": "e6e52036-2002-4455-87cf-f49b7e581e8d",
    "cardToken": "39f3e8e9-740e-4d53-be61-b73fee9b4baf",
    "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
    "state": "ACTIVE",
    "reason": "I want to use this card, so activate it.",
    "reasonCode": "00",
    "channel": "API",
    "fulfillmentStatus": "ISSUED",
    "validations": {
      "user": {
        "birthDate": false,
        "phone": false,
        "ssn": false,
        "randomNameLine1Postfix": false
      }
    },
    "type": "state.activated",
    "createdTime": "2022-06-02T20:10:33Z",
    "cardProductToken": "ffa4020f-e42c-4e98-a63f-43ba2ad446b3",
    "lastFour": "5992",
    "pan": "111111______5992",
    "expiration": "0626",
    "expirationTime": "2026-06-30T23:59:59.000Z",
    "barcode": "21328141077422732522",
    "pinIsSet": false,
    "user": {
      "metadata": { }
    },
    "card": {
      "metadata": { }
    }
  }
}
```

#### [Retrieve Card Transition](https://www.marqeta.com/docs/core-api/card-transitions#getCardtransitionsToken)

To retrieve a card transition by token Id, you can use this call:

```typescript
const resp = await client.cardTransition.retrieve(
  'e6e52036-2002-4455-87cf-f49b7e581e8d'
)
```

and the response will look something like this:

```javascript
{
  "success": true,
  "cardTransition": {
    "token": "e6e52036-2002-4455-87cf-f49b7e581e8d",
    "cardToken": "39f3e8e9-740e-4d53-be61-b73fee9b4baf",
    "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
    "state": "ACTIVE",
    "reason": "I want to use this card, so activate it.",
    "reasonCode": "00",
    "channel": "API",
    "fulfillmentStatus": "ISSUED",
    "validations": {
      "user": {
        "birthDate": false,
        "phone": false,
        "ssn": false,
        "randomNameLine1Postfix": false
      }
    },
    "type": "state.activated",
    "createdTime": "2022-06-02T20:10:33Z",
    "cardProductToken": "ffa4020f-e42c-4e98-a63f-43ba2ad446b3",
    "lastFour": "5992",
    "pan": "111111______5992",
    "expiration": "0626",
    "expirationTime": "2026-06-30T23:59:59.000Z",
    "barcode": "21328141077422732522",
    "pinIsSet": false,
    "user": {
      "metadata": { }
    },
    "card": {
      "metadata": { }
    }
  }
}
```

#### [List Card Transitions](https://www.marqeta.com/docs/core-api/card-transitions#getCardtransitionsCardToken)

To get a list of Card Transitions, use this call with a Card token Id and 
optional filter fields:

```typescript
const resp = await client.cardTransition.list(
 '39f3e8e9-740e-4d53-be61-b73fee9b4baf',
  { 
    count: 2, 
    startIndex: 0,
    sortBy: 'lastModifiedTime',
  }
)
```

and the response will look something like this:

```javascript
{
  "success": true,
  "cardTransitions": {
    "count": 2,
    "startIndex": 0,
    "endIndex": 1,
    "isMore": false,
    "data": [
      {
        "token": "4d1ddec6-0a38-4deb-8e99-55248cee11b0",
        "cardToken": "39f3e8e9-740e-4d53-be61-b73fee9b4baf",
        "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
        "state": "UNACTIVATED",
        "reason": "New card",
        "reasonCode": "00",
        "channel": "SYSTEM",
        "fulfillmentStatus": "ISSUED",
        "validations": {
          "user": {
            "birthDate": false,
            "phone": false,
            "ssn": false,
            "randomNameLine1Postfix": false
          }
        },
        "type": "fulfillment.issued",
        "createdTime": "2022-06-02T20:10:33Z",
        "cardProductToken": "ffa4020f-e42c-4e98-a63f-43ba2ad446b3",
        "lastFour": "5992",
        "pan": "111111______5992",
        "expiration": "0626",
        "expirationTime": "2026-06-30T23:59:59.000Z",
        "barcode": "21328141077422732522",
        "pinIsSet": false,
        "user": {
          "metadata": { }
        },
        "card": {
          "metadata": { }
        }
      },
      {
        "token": "e6e52036-2002-4455-87cf-f49b7e581e8d",
        "cardToken": "39f3e8e9-740e-4d53-be61-b73fee9b4baf",
        "userToken": "09d921f5-5a0b-4a31-b76a-603bb12b1329",
        "state": "ACTIVE",
        "reason": "I want to use this card, so activate it.",
        "reasonCode": "00",
        "channel": "API",
        "fulfillmentStatus": "ISSUED",
        "validations": {
          "user": {
            "birthDate": false,
            "phone": false,
            "ssn": false,
            "randomNameLine1Postfix": false
          }
        },
        "type": "state.activated",
        "createdTime": "2022-06-02T20:10:33Z",
        "cardProductToken": "ffa4020f-e42c-4e98-a63f-43ba2ad446b3",
        "lastFour": "5992",
        "pan": "111111______5992",
        "expiration": "0626",
        "expirationTime": "2026-06-30T23:59:59.000Z",
        "barcode": "21328141077422732522",
        "pinIsSet": false,
        "user": {
          "metadata": { }
        },
        "card": {
          "metadata": { }
        }
      }
    ]
  }
}
```

## Development

For those interested in working on the library, there are a few things that
will make that job a little simpler. The organization of the code is all in
`src/`, with one module per _section_ of the Client: `business`, `user`,
etc. This makes location of the function very easy.

Additionally, the main communication with the Marqeta service is in the
`src/index.ts` module in the `fire()` function. In the constructor for the
Client, each of the _sections_ are created, and then they link back to the
main class for their communication work.

### Setup

In order to work with the code, the development dependencies include `dotenv`
so that each user can create a `.env` file with a single value for working
with Marqeta:

* `MARQETA_API_APP_TOKEN` - this is the API Application Token as provided 
  by Marqeta when setting up a user and sandbox.
* `MARQETA_API_ACCESS_TOKEN` - this is the API User Access Token as provided 
  by Marqeta when setting up a user and sandbox. 
* `MARQETA_HOST` - this is the specific host where calls should be sent, and
  will default to the Marqeta production host, but can also be set to be the
  `sandbox` instance for testing. This will need to include the `/api` on
  the end - in keeping with the documents sent by Marqeta to get started.

### Testing

There are several test scripts that test, and validate, information on the
Marqeta service exercising different parts of the API. Each is
self-contained, and can be run with:

```bash
$ npm run ts tests/business.test.ts

> marqeta-node-client@0.1.0 ts
> ts-node -r dotenv/config "tests/business.test.ts"

Success! Marqeta Client created.
