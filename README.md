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

> The users resource represents a person who accesses Marqeta-administered 
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
