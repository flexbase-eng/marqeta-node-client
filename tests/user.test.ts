'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })


  console.log('getting list of Users...')
  const list = await client.user.list()

  if (list?.body?.isMore) {
    console.log(`Success! ${list.body!.count} Users were retrieved.`)
  }

})()
