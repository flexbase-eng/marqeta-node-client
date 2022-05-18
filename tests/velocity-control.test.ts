'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockVelocityControl = {
    usage_limit: 10,
    amount_limit: 500,
    velocity_window: 'DAY',
    association: {
      userToken: ''
    },
    currency_code: 'USD',
    token: ''
  }

  console.log('getting a user ...')
  let user
  const userList = await client.user.list({ count: 1 })

  if (userList?.body?.isMore && Array.isArray(userList?.body?.data)) {
    user = userList.body.data.pop()
    if (user?.token) {
      mockVelocityControl.association.userToken = user.token
      const control = await client.velocityControl.create(mockVelocityControl)
      if (control.success && control?.body?.token) {
        console.log('Success! A velocity control was created for user: ' +
          user?.token)
      } else {
        console.log('Success! Unable to create a velocity control for user: ' +
          + user?.token)
        console.log(control)
      }
    } else {
      console.log('Error! Empty user token Id.')
    }
  } else {
    console.log('Error! Unable to get a list of users.')
    console.log(userList)
  }

  const products = await client.cardProduct.list()

  if (products?.body?.isMore && Array.isArray(products?.body?.data)) {
    console.log('getting a list of velocity controls ...')
    const oneProduct = products.body.data.pop()
    if (oneProduct?.token) {
      const velocityList = await client.velocityControl.list({
        cardProduct: oneProduct.token
      })
      if (velocityList?.success) {
        console.log('Success! A list of velocity controls was retrieved for ' +
         ' card product token Id: ' + oneProduct.token)
      } else {
        console.log('Error! Failed to retrieve a list of velocity controls ' +
        'for card product token Id: ' + oneProduct.token)
        console.log(velocityList)
      }
    } else {
      console.log('Error! Empty card product token Id.')
      console.log(oneProduct)
    }
  } else {
    console.log('Error! Unable to get a list of card products.')
  }

})()
