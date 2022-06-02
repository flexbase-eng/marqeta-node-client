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

  console.log('creating Card Product...')
  const cardProduct = await client.cardProduct.create(mockCardProduct)

  if (cardProduct?.success && cardProduct?.cardProduct?.token) {
    console.log('Success! Card Product created.')
  } else {
    console.log('Error! Unable to create a Card Product.')
    console.log(cardProduct)
  }

  console.log('retrieving Card Product...')

  if (cardProduct?.cardProduct?.token) {
    const foundB = await client.cardProduct.retrieve(
      cardProduct.cardProduct?.token
    )

    if (foundB.success && foundB?.cardProduct?.token) {
      console.log('Success! Found Card Product by token Id.')
    } else {
      console.log('Error! Unable to get Card Product by token Id.')
      console.log(foundB)
    }
  } else {
    console.log('Error! Empty Card Product token Id.')
    console.log(cardProduct)
  }

  console.log('updating Card Product...')

  if (cardProduct?.cardProduct?.token) {
    const orgName = cardProduct.cardProduct.name
    let updated

    if (cardProduct.cardProduct.name) {
      cardProduct.cardProduct.name += Math.floor(Math.random() * 100) + 1
      updated = await client.cardProduct.update(cardProduct.cardProduct)
    }

    if (updated?.cardProduct?.token) {
      console.log('Success! The Card Product name was updated from "' +
          orgName + '" to "' + updated.cardProduct?.name + '"')
    } else {
      console.log('Error! Unable to update Card Product')
      console.log(updated)
    }
  } else {
    console.log('Error! Empty Card Product token Id.')
    console.log(cardProduct)
  }

  console.log('getting list of Card Products...')
  const products = await client.cardProduct.list()

  if (Array.isArray(products?.cardProducts?.data)
         && products?.cardProducts?.count) {
    console.log('Success! Retrieved a list of Card Products.')
  } else {
    console.log('Error! Unable to retrieve a list of Card Products.')
    console.log(products)
  }

})()
