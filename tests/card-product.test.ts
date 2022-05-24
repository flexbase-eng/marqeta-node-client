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
    const listItem1 = products?.cardProducts?.data?.pop()

    console.log('testing getting list of Marqeta Card Products...')
    if (listItem1?.token) {
      console.log('Success! We were able to get Marqeta Card Products')
      console.log(`getting Marqeta Card Product by id: ${listItem1.token}`)
      const fouA = await client.cardProduct.byTokenId(listItem1.token)

      if (fouA?.cardProduct?.token) {
        console.log('Success! The Marqeta Card Product was found by id: ' +
            JSON.stringify(fouA.cardProduct.token))
        let upA
        const fouAName = fouA.cardProduct.name

        if (fouA.cardProduct?.name) {
          fouA.cardProduct.name += Math.floor(Math.random() * 100) + 1
          upA = await client.cardProduct.update(fouA.cardProduct)
        }

        if (upA?.success) {
          console.log('Success! The Card Product  name was updated from "' +
              fouAName + '" to "' + upA.cardProduct?.name + '"')
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

    if (cardProductA?.success && cardProductA?.cardProduct?.token) {
      console.log('Success! The Card Product. "' +
          cardProductA.cardProduct?.name +
          '" was created with token: ' + cardProductA.cardProduct?.token)
      console.log('getting Card Product by id: ' + cardProductA.cardProduct?.token)
      const foundB = await client.cardProduct.byTokenId(cardProductA.cardProduct?.token)

      if (foundB.success && foundB?.cardProduct?.token) {
        console.log('Success! The Card Product  "' +
            cardProductA.cardProduct?.name + '" was found with Card Product id: ' +
            cardProductA?.cardProduct?.token)
        console.log('updating Card Product name...')
        const orgNameB = foundB.cardProduct.name
        let updatedB

        if (foundB.cardProduct.name) {
          foundB.cardProduct.name += Math.floor(Math.random() * 100) + 1
          updatedB = await client.cardProduct.update(foundB.cardProduct)
        }

        if (updatedB?.cardProduct?.token) {
          console.log('Success! The Card Product name was updated from "' +
              orgNameB + '" to "' + updatedB.cardProduct?.name + '"')
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
