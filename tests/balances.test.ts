'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting a list of Businesses...')
  const list = await client.business.list()

  if (Array.isArray(list.businesses?.data)) {
    const business = list.businesses?.data.pop()

    if (business?.token) {
      const balances = await client.balances.byTokenId(business.token)

      if (balances?.success) {
        console.log('Success! Balances retrieved for Business with token Id:' +
          business.token)
      } else {
        console.log('Error! Unable to get Business token Id.')
        console.log(balances)
      }
    } else {
      console.log('Error! Empty Business token Id.')
    }
  } else {
    console.log('Error! Empty business list.')
    console.log(list)
  }

})()
