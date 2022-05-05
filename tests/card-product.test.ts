'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockCardProduct = {
    'name': 'Acme Ipsum INC',
    'startDate': '2019-08-24T14:15:22Z'
  }

  if (client) {
    console.log('Success! Client initialized')
    console.log('getting Marqeta Card Products...')

    const products = await client.cardProduct.list()
    const listItem1 = products?.body?.data?.pop()

    console.log('testing getting list of Marqeta Card Products...')
    if (listItem1?.token) {
      console.log('Success! We were able to get Marqeta Card Products')
      console.log(`getting Marqeta Card Product by id: ${listItem1.token}`)
      const fouA = await client.cardProduct.byTokenId(listItem1.token)

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
          console.log('Success! The Card Product  name was updated from "' +
              fouAName + '" to "' + upA.body?.name + '"')
        } else {
          console.log('Error! Unable to update the Card Product ')
          console.log(upA)
        }
      }
    } else {
      console.log('Error! Could not get a list of Card Products')
    }

    console.log('testing creating Marqeta Card Product...')
    const cardProductA = await client.cardProduct.create(mockCardProduct)

    if (cardProductA?.success && cardProductA?.body?.token) {
      console.log('Success! The Card Product. "' +
          cardProductA.body?.name +
          '" was created with token: ' + cardProductA.body?.token)
      console.log('getting Card Product by id: ' + cardProductA.body?.token)
      const foundB = await client.cardProduct.byTokenId(cardProductA.body?.token)

      if (foundB.success && foundB?.body?.token) {
        console.log('Success! The Card Product  "' +
            cardProductA.body?.name + '" was found with Card Product id: ' +
            cardProductA?.body?.token)
        console.log('updating Card Product name...')
        const orgNameB = foundB.body.name
        let updatedB

        if (foundB.body.name) {
          foundB.body.name += Math.floor(Math.random() * 100) + 1
          updatedB = await client.cardProduct.update(foundB.body)
        }

        if (updatedB?.body?.token) {
          console.log('Success! The Card Product name was updated from "' +
              orgNameB + '" to "' + updatedB.body?.name + '"')
        } else {
          console.log('Error! Unable to update the Card Product')
          console.log(updatedB)
        }
      } else {
        console.log('Error! Unable to get Card Products by id.')
        console.log(foundB)
      }

    } else {
      console.log('Error! Unable to create a Card Product.')
      console.log(cardProductA)
    }

  } else {
    console.log('Error! Could not create a Marqeta Client instance')
  }

})()
