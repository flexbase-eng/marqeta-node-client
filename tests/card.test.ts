'use strict'

import { Marqeta } from '../src'

(async () => {

  const mockCard = {
    cardProductToken: '',
    userToken: '',
  }
  console.log('initializing Marqeta Client...')
  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  if (client) {
    console.log('Success! Client initialized')
    console.log('getting a list of Marqeta Users...')
    const users = await client.user.list()

    if (
      users?.body?.isMore
      && users?.body?.count > 0
      && Array.isArray(users?.body?.data)
    ) {
      console.log('getting the User Marqeta Card Products...')
      const products = await client.cardProduct.list()
      const user = users?.body?.data.pop()
      let newCard
      if (products?.body?.isMore && Array.isArray(products?.body?.data)) {
        const product = products?.body?.data.pop()

        if (user?.token && product?.token) {
          mockCard.userToken = user.token
          mockCard.cardProductToken = product.token
          newCard = await client.card.create(mockCard)
          if (newCard.success && newCard?.body?.token) {
            console.log('Success! New Card created.')
          } else {
            console.log('Error! Unable to create a new Card.')
            console.log(newCard)
          }
        }
      }

      console.log('retrieving new Card by barcode...')
      if (newCard?.body?.barcode) {
        const foundCard = await client.card.byBarcode(newCard?.body.barcode)
        if (foundCard?.body?.token) {
          console.log('Success! New Card retrieved by barcode.')
        } else {
          console.log('Error! Unable to retrieve the new Card by barcode.')
        }
      } else {
        console.log('Error! Unable to retrieve the new Card by barcode. ' +
          'The Card does not exist')
        console.log(users)
      }

      console.log('getting a list of Marqeta Cards by User token Id...')
      if (user?.token) {
        const userCards = await client.card.listByUser(user?.token)
        if (userCards?.success && userCards?.body?.count) {
          console.log('Success! Found Marqeta Cards by User token and ' +
            '{count:1} search option')
        } else {
          console.log('Error! Unable to find any Marqeta Cards by User token ' +
            ' and {count:1} search option')
          console.log(userCards)
        }
      } else {
        console.log('Error! User token empty, cannot get a list of Cards')
        console.log(user)
      }

    } else {
      console.log('Error! Unable to get a list of Marqeta Users')
      console.log(users)
    }

  } else {
    console.log('Error! Could not create a Client instance')
  }
})()
