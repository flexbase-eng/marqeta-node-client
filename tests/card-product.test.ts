'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  if (client) {
    console.log('Success! Client initialized')
    console.log('getting Marqeta Card Products...')

    const products = await client.cardProduct.list()

    if (products?.success) {
      console.log('Success! We were able to get the Marqeta Card Products')
      const lstItem1 = products?.body?.data?.pop()

      if (lstItem1?.token) {
        console.log(`getting Marqeta Card Product by id: ${lstItem1.token}`)
        const fouA = await client.cardProduct.byTokenId(lstItem1.token)

        if (fouA?.body?.token) {
          console.log('Success! The Marqeta Card Product was found by id: ' +
            JSON.stringify(fouA.body.token))
        }
      }

    } else {
      console.log('Error! Could not get any Card Products')
    }
  } else {
    console.log('Error! Could not create a Client instance')
  }

})()
