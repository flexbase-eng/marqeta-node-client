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

  console.log('getting a list of one Webhooks...')
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

  console.log('updating one Webhook...')

  if (listOne.body?.data && Array.isArray(listOne.body?.data)) {
    const update = listOne.body.data.pop()

    if (update && update?.name) {
      const originalName = update.name
      update.name += Math.floor(Math.random() * 100) + 1
      const updatedHook = await client.webHooks.update(update)

      if (updatedHook?.body?.name != originalName) {
        console.log('Success! Webhook name was updated from "' + originalName +
        '" to "' + updatedHook.body?.name + '" was retrieved.')
      } else {
        console.log('Error! Unable to update Webhook.')
        console.log(updatedHook)
      }
    } else {
      console.log('Error! Unable to update empty Webhook.')
      console.log(update)
    }
  }

})()
