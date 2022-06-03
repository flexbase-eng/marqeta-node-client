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

  if (userList?.userList?.isMore && Array.isArray(userList?.userList?.data)) {
    user = userList.userList.data.pop()

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

  if (authControl?.authorizationControl?.token) {
    console.log('getting user authorization control by token Id...')
    const found = await client.authorizationControl.retrieve({
      token: authControl?.authorizationControl?.token
    })
    if (found.success && found?.authorizationControl?.token) {
      console.log('Success! Authorization control retrieved by token Id.')
    } else {
      console.log('Error! Unable to get authorization control by token Id.')
      console.log(found)
    }
  } else {
    console.log('Error! Empty Authorization Control token Id')
    console.log(authControl)
  }

  if (authControl?.authorizationControl?.token) {
    console.log('updating user authorization control by token Id...')

    let updated, originalActive
    if (authControl?.authorizationControl?.active) {
      originalActive = authControl.authorizationControl.active
      authControl.authorizationControl.active = !authControl.authorizationControl.active
      updated = await client.authorizationControl.update(
        authControl.authorizationControl
      )
    }
    if (updated?.success && updated?.authorizationControl?.token) {
      console.log('Success! Authorization control active status: "' +
      originalActive + '" was updated to: "' + updated?.authorizationControl?.active)
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
  let mid = await client.authorizationControl.createMerchant({
    name: 'test_1111',
    mid: '123456789102',
  })
  if (mid?.success) {
    console.log('Success! Merchant Identifier exemption created.')
  } else {
    console.log('Error! Unable to create Merchant Identifier exemption.')
    console.log(mid)
  }

  console.log('retrieving Merchant Identifier exemption...')
  let foundMerchant
  if (mid?.merchant?.token) {
    foundMerchant = await client.authorizationControl.retrieveMerchantExemption(
      mid.merchant.token
    )
    if (foundMerchant?.success) {
      console.log('Success! Merchant Identifier exemption retrieved.')
    } else {
      console.log('Error! Unable to get Merchant Identifier exemption.')
      console.log(foundMerchant)
    }
  } else {
    console.log('Error! Empty Merchant Identifier token.')
    console.log(mid)
  }

  console.log('list Merchant Identifier Exemptions...')
  if (user?.token) {
    const merchantList = await client.authorizationControl.
      listMerchantExemptions({
        user: user.token,
        count: 1,
      })
    if (merchantList?.success) {
      console.log('Success! List of Merchant Identifier Exemptions retrieved' +
        'for user with token Id: ' + user.token)
    } else {
      console.log('Error! Unable to get a List of Merchant Identifier ' +
        'Exemptions for user with token Id: ' + user.token)
      console.log(merchantList)
    }
  } else {
    console.log('Error! Empty User token.')
    console.log(user)
  }

  console.log('updating Merchant Identifier exemption status...')
  if (foundMerchant?.merchant?.active) {
    const originalStatus = foundMerchant.merchant.active
    foundMerchant.merchant.active = !foundMerchant.merchant.active
    const updatedMerchant = await client.authorizationControl.
      updateMerchantStatus(
        foundMerchant.merchant
      )
    const updatedStatus = await client.authorizationControl.
      retrieve({
        token: foundMerchant?.merchant?.token
      })

    if (updatedMerchant?.success
      && originalStatus != updatedStatus?.authorizationControl?.active
      && updatedStatus?.authorizationControl?.active != undefined) {
      console.log('Success! Merchant Identifier exemption active status ' +
        'updated from "' + originalStatus + '" to "' +
        updatedStatus?.authorizationControl?.active + '"')
    } else {
      console.log('Error! Unable to update Merchant Identifier active status.')
      console.log(updatedMerchant)
    }
  } else {
    console.log('Error! Empty Merchant Identifier Exemption active status.')
    console.log(foundMerchant)
  }

})()
