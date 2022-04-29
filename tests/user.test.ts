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
  } else {
    console.log('Error! Unable to get a list of 1 User.')
    console.log(list)
  }
  console.log('getting list of 1 User...')
  const listA = await client.user.list({ count: 1 })
  if (listA?.body?.count && listA.body.count > 0) {
    console.log(`Success! ${listA.body!.count} Users were retrieved.`)
  } else {
    console.log('Error! Unable to get a list of 1 User using count parameter.')
    console.log(listA)
  }

})()
