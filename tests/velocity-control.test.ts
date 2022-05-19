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
        console.log('Error! Unable to create a velocity control for user: ' +
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

  let velocityList
  if (products?.body?.isMore && Array.isArray(products?.body?.data)) {
    console.log('getting a list of velocity controls ...')
    const oneProduct = products.body.data.pop()
    if (oneProduct?.token) {
      velocityList = await client.velocityControl.list({
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

  console.log('getting a velocity control by token Id...')
  let oneVelocity
  if (velocityList?.success && Array.isArray(velocityList?.body?.data)) {
    oneVelocity = velocityList?.body?.data.pop()
    if (oneVelocity?.token) {
      const foundVelocity = await client.velocityControl.byTokenId(
        oneVelocity.token
      )
      if (foundVelocity.success) {
        console.log('Success! The Velocity Control was retrieved by token' +
          ' Id: ' + oneVelocity.token)
      } else {
        console.log('Error! Unable to retrieve the Velocity Control by' +
          ' token Id: ' + oneVelocity.token)
        console.log(foundVelocity)
      }
    } else {
      console.log('Error! Empty Velocity Control token Id.')
      console.log(oneVelocity)
    }
  } else {
    console.log('Error! Unable to get a list of velocity controls.')
  }

  console.log('updating a velocity control...')
  if (oneVelocity?.token) {
    const origActive = oneVelocity.active
    console.log(`[original active:] ${JSON.stringify(origActive)}`)
    oneVelocity.active = !oneVelocity.active

    const updateVelocity = await client.velocityControl.update(
      oneVelocity
    )
    if (updateVelocity.success && updateVelocity?.body?.active != undefined) {
      console.log('Success! The Velocity Control active status was updated ' +
          'from "' + origActive + '" to "' + updateVelocity.body.active + '"')
    } else {
      console.log('Error! Unable to update the Velocity Control active status.')
      console.log(updateVelocity)
    }
  } else {
    console.log('Error! Unable to get a list of velocity controls.')
  }

  console.log('getting a list of user velocity controls...')
  if (user?.token) {
    const control = await client.velocityControl.byUser({
      token: user.token,
      count: 1
    })
    if (control.success && control?.body?.isMore) {
      console.log('Success! A list of velocity controls was retrieved for user: ' +
        user?.token)
    } else {
      console.log('Error! Unable to get a list of velocity controls for user: ' +
        + user?.token)
      console.log(control)
    }
  } else {
    console.log('Error! Empty user token Id.')
  }

})()
