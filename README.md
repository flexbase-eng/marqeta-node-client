# marqeta-node-client
`marqeta-node-client` is a Node/JS and TypeScript Client for 
[Marqeta](https://www.marqeta.com/) that allows you to use normal Node
syntax to Users, Businesses, Cards, Transactions and other data from the Marqeta 
[API](https://www.marqeta.com/docs/core-api/introduction)

## Install

```bash
# with npm
$ npm install peach-node-client
```

## usage

this readme isn't going to cover all the specifics of what Marqeta is,
and how to use it - it's targeted as a _companion_ to the Marqeta developer
[docs](https://www.marqeta.com/docs/developer-guides)
that explain each of the endpoints and how the general Marqeta
[API](https://www.marqeta.com/docs/core-api/introduction) works.


### Getting your API Key

Create an [account](https://www.marqeta.com/users/sign_up) on the Marqeta 
platform. As part of creating your account on Marqeta.com, you will also 
create a [sandbox](https://www.marqeta.com/docs/developer-guides/core-api-quick-start#_create_a_sandbox) 
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
const client = new Marqeta({ apiKey: '123456789abcd' })
```

