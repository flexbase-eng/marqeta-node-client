'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting a list of Webhooks...')
  const list = await client.webHooks.list()

  if (list.body?.isMore) {
    console.log(`Success! ${list.body!.count} Webhooks were retrieved.`)
  } else {
    console.log('Error! Unable to get a list of Webhooks.')
    console.log(list)
  }

  console.log('getting a list of onew Webhooks...')
  const listOne = await client.webHooks.list({ count: 1 })

  if (listOne.body?.data && Array.isArray(listOne.body?.data)) {
    if(listOne.body.data.length === 1){
      console.log(`Success! One ${listOne.body!.count} Webhook was retrieved.`)
    } else {
      console.log('Error! Unable to get a list of one Webhook.')
      console.log(listOne)
    }
  } else {
    console.log('Error! Unable to get a list Webhooks.')
    console.log(listOne)
  }

})()
