'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })
  if (client) {
    console.log('Success! Client initialized')
  } else {
    console.log('Error! Could not create a Client instance')
  }
})()
