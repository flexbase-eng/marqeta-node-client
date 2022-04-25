'use strict'

import { Marqeta } from '../src/index';
(async () => {
  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })
  if (client) {
    console.log('Success! Marqeta Client created.')
  } else {
    console.log('Error! Marqeta Client not created.')
  }
})()