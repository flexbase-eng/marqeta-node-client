'use strict'

import { Marqeta } from '../src'
import { DateTime } from 'ts-luxon'

(async () => {

  const dt = DateTime.now()
  const mockWebhook =
  {
    token: 'test.' + dt.toISOTime(),
    name: 'webhooks.test.' + dt.toISOTime(),
    active: false,
    events: [
      '*'
    ],
    config: {
      url: 'https://baconipsum.com',
      basicAuthUsername: 'ipsum',
      basicAuthPassword: 'WFx&Q44Roc/LUjaDjx2SvyK'
    }
  }

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
    if (listOne.body.data.length === 1) {
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
      update.name = mockWebhook.name
      const updatedHook = await client.webHooks.update(update)

      if (updatedHook?.body?.name != undefined
        && updatedHook?.body?.name != originalName) {
        console.log('Success! Webhook name was updated from "' + originalName +
        '" to "' + updatedHook?.body?.name + '" was retrieved.')
      } else {
        console.log('Error! Unable to update Webhook.')
        console.log(updatedHook)
      }
    } else {
      console.log('Error! Unable to update empty Webhook.')
      console.log(update)
    }
  }
  console.log('creating Webhook...')
  const created = await client.webHooks.create(mockWebhook)

  if (created?.success && created?.body?.token) {
    console.log('Success! Webhook created with token id: "' +
      created?.body?.token + '"')
  } else {
    console.log('Error! Unable to create Webhook.')
    console.log(created)
  }

})()
