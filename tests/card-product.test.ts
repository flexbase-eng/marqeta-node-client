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
          let upA
          const fouAName = fouA.body.name

          if (fouA.body?.name) {
            fouA.body.name += Math.floor(Math.random() * 100) + 1
            upA = await client.cardProduct.update(fouA.body)
          }

          if (upA?.success) {
            console.log('Success! The Card Product account name was updated from "' +
              fouAName + '" to "' + upA.body?.name + '"')
          } else {
            console.log('Error! Unable to update the Card Product account')
            console.log(upA)
          }
        }
      }

    } else {
      console.log('Error! Could not get any Card Products')
    }

  } else {
    console.log('Error! Could not create a Client instance')
  }

})()
