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
        mockAuthControl
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

})()
