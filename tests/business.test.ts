'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting list of Businesses...')
  let one
  one = await client.business.list()
  if (one?.success && one.body?.isMore) {
    console.log(`Success! A list ${one?.body!.count} Businesses were retrieved: `)
  } else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(one)
  }
  console.log('getting list of unknown Businesses with search parameter: "{ businessNameDba:xyz }"...')
  one = await client.business.list({ businessNameDba:'xyz' })
  if (one?.success && one.body?.isMore) {
    console.log(`Success! A list ${one?.body!.count} Businesses were retrieved: `)
  } else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(one)
  }
})()
