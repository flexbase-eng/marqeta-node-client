'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockAuthControl = {
    merchantScope: {
      mid: '98765'
    },
    association: {
      userToken: ''
    },
    token: '',
    name: 'TestAuthControl'
  }

  console.log('getting a user ...')
  let user, authControl
  const userList = await client.user.list({ count: 1 })

  if (userList?.body?.isMore && Array.isArray(userList?.body?.data)) {
    user = userList.body.data.pop()

    if (user?.token) {
      console.log('creating user authorization control ...')
      mockAuthControl.association.userToken = user.token
      authControl = await client.authorizationControl.create(
        { ...mockAuthControl }
      )
      if (authControl?.success) {
        console.log('Success! Authorization Control created for user: ' +
          user.token)
      } else {
        console.log('Error! Unable to create Authorization Control for user: ' +
          user.token)
        console.log(authControl)
      }
    } else {
      console.log('Error! Empty user token.')
      console.log(user)
    }
  } else {
    console.log('Error! Unable to get a list of users.')
    console.log(userList)
  }

  if (authControl?.body?.token) {
    console.log('getting user authorization control by token Id...')
    const found = await client.authorizationControl.byTokenId({
      token: authControl?.body?.token
    })
    if (found.success && found?.body?.token) {
      console.log('Success! Authorization control retrieved by token Id.')
    } else {
      console.log('Error! Unable to get authorization control by token Id.')
      console.log(found)
    }
  } else {
    console.log('Error! Empty Authorization Control token Id')
    console.log(authControl)
  }

  if (authControl?.body?.token) {
    console.log('updating user authorization control by token Id...')

    let updated, originalActive
    if (authControl?.body?.active) {
      originalActive = authControl.body.active
      authControl.body.active = !authControl.body.active
      updated = await client.authorizationControl.update(
        authControl.body
      )
    }
    if (updated?.success && updated?.body?.token) {
      console.log('Success! Authorization control active status: "' +
      originalActive + '" was updated to: "' + updated?.body?.active)
    } else {
      console.log('Error! Unable to update Authorization control status.')
      console.log(updated)
    }
  } else {
    console.log('Error! Empty Authorization Control token Id')
    console.log(authControl)
  }

  if (user?.token) {
    console.log('getting a list of user authorization controls ...')
    const list = await client.authorizationControl.list({
      user: user.token,
      count: 1
    })
    if (list?.success) {
      console.log('Success! A list of Authorization Controls was found for ' +
        'user: ' + user.token)
    } else {
      console.log('Error! Unable to retrieve a list of Authorization ' +
      'Controls for user: ' + user.token)
      console.log(list)
    }
  } else {
    console.log('Error! Empty user token.')
    console.log(user)
  }

  console.log('creating Merchant Identifier exemption...')
  const list = await client.authorizationControl.createMerchant({
    name: 'test_1111',
    mid: '123456789102',
  })
  if (list?.success) {
    console.log('Success! Merchant Identifier exemption created.')
  } else {
    console.log('Error! Unable to create Merchant Identifier exemption.')
    console.log(list)
  }

})()
