'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting a Marqeta user ...')
  const userList = await client.user.list({ count: 1 })

  let user
  if (userList?.body?.isMore && Array.isArray(userList?.body?.data)) {
    user = userList.body.data.pop()
    if (user?.token) {
      console.log('getting user transactions by user token Id...')
      const transactions = await client.transactions.list({
        userToken: user.token,
        count: 1
      })
      if (transactions.success) {
        console.log('Success! A list of transactions was retrieved for user: '
          + user?.token)
      } else {
        console.log('Error! A list of transactions was retrieved for user: '
          + user?.token)
        console.log(transactions)
      }
    } else {
      console.log('Error! Empty user token Id.')
    }
  } else {
    console.log('Error! Unable to get a list of Marqeta users.')
    console.log(userList)
  }

})()
