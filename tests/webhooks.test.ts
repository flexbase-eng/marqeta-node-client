'use strict'

import { Marqeta } from '../src'

(async () => {

  const dt = new Date().toISOString()
  const mockWebhook = {
    token: 'test.' + dt,
    name: 'webhooks.test.' + dt,
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

  if (list.webhooksList?.isMore) {
    console.log(`Success! ${list.webhooksList!.count} Webhooks were retrieved.`)
  } else {
    console.log('Error! Unable to get a list of Webhooks.')
    console.log(list)
  }

  console.log('getting a list of one Webhooks...')
  const listOne = await client.webHooks.list({ count: 1 })

  if (listOne.webhooksList?.data && Array.isArray(listOne.webhooksList?.data)) {
    if (listOne.webhooksList.data.length === 1) {
      console.log(`Success! One ${listOne.webhooksList!.count} Webhook was retrieved.`)
    } else {
      console.log('Error! Unable to get a list of one Webhook.')
      console.log(listOne)
    }
  } else {
    console.log('Error! Unable to get a list Webhooks.')
    console.log(listOne)
  }

  console.log('updating one Webhook...')

  if (listOne.webhooksList?.data && Array.isArray(listOne.webhooksList?.data)) {
    const update = listOne.webhooksList.data.pop()

    if (update && update?.name) {
      const originalName = update.name
      update.name = mockWebhook.name
      const updatedHook = await client.webHooks.update(update)

      if (updatedHook?.webhook?.name != undefined
        && updatedHook?.webhook?.name != originalName) {
        console.log('Success! Webhook name was updated from "' + originalName +
        '" to "' + updatedHook?.webhook?.name + '" was retrieved.')
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

  if (created?.success && created?.webhook?.token) {
    console.log('Success! Webhook created with token id: "' +
      created?.webhook?.token + '"')
  } else {
    console.log('Error! Unable to create Webhook.')
    console.log(created)
  }

  console.log('get Webhook by token Id...')

  if (list.webhooksList?.data && Array.isArray(list.webhooksList?.data)) {
    const item = list.webhooksList.data.pop()

    if (item && item?.token) {
      const found = await client.webHooks.retrieve(item.token)

      if (found?.webhook?.token) {
        console.log('Success! Webhook was retrieved by token Id: ' + found.webhook.token)
      } else {
        console.log('Error! Unable to get Webhook by token Id.')
        console.log(found)
      }
    } else {
      console.log('Error! Unable to retrieve Webhook with missing token Id.')
      console.log(item)
    }
  }

})()
