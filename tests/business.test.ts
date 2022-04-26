'use strict'

import { Marqeta } from '../src/index';

(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })
  const one = await client.business.list()
  if (one.success) {
    console.log(`Success! A list ${one.businesses!.count} Businesses were retrieved: `)
  } else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(one)
  }
})()
