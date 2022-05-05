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

    if (users?.body?.isMore && Array.isArray(users?.body?.data)) {
      console.log('getting the User Marqeta Card Products...')
      const products = await client.cardProduct.list()

      if (products?.body?.isMore && Array.isArray(products?.body?.data)) {
        const product = products?.body?.data.pop()
        const user = users?.body?.data.pop()

        if (user?.token && product?.token) {
          mockCard.userToken = user.token
          mockCard.cardProductToken = product.token
          const newCard = await client.card.create(mockCard)
          if (newCard.success && newCard?.body?.token) {
            console.log('Success! New Card created.')
          } else {
            console.log('Error! Unable to create a new Card.')
            console.log(newCard)
          }
        }
      }
    }
  } else {
    console.log('Error! Could not create a Client instance')
  }
})()
