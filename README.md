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
  apiAppToken: '705b5bc0-c4d3-11ec-9d64-0242ac120002',
  apiAccessToken: 'abbykj26-z8a1-21ea-8c64-92d6ac1a0002'
})
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
