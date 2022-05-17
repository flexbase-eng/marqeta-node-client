'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting list of one Marqeta user...')
  const userList = await client.user.list({ count: 1 })

  let user
  if (userList?.body?.isMore && Array.isArray(userList?.body?.data)) {
    user = userList.body.data.pop()
    if (user?.token) {
      console.log('sending a User KYC request to Marqeta...')
      const verified = await client.kyc.verify({
        userToken: user.token
      })
      if (verified.success) {
        console.log('Success! KYC success for user: ' + user?.token)
      } else {
        console.log('Error! KYC failed for user: ' + user?.token)
        console.log(user)
      }
    } else {
      console.log('Error! Empty user token Id.')
    }
  } else {
    console.log('Error! Unable to get a list of Users to test KYC.')
    console.log(userList)
  }

  if (user?.token) {
    console.log('getting list of Marqeta User KYC results...')
    const userResults = await client.kyc.userResults({ ...user })
    if (userResults?.success && Array.isArray(userResults?.body?.data)) {
      console.log('Success! A list of KYC results was returned for user: ' +
        user.token
      )
    } else {
      console.log('Error! Unable to get a list of KYC results for user: ' +
        user.token)
      console.log(userResults)
    }
  } else {
    console.log('Error! Empty User token Id. Cannot get a list of User KYC ' +
      'results')
  }

  console.log('getting list of one Marqeta business...')
  const businessList = await client.business.list({ count: 1 })

  if (businessList?.body?.isMore && Array.isArray(businessList?.body?.data)) {
    const business = businessList.body.data.pop()
    if (business?.token) {
      console.log('sending a Business KYB request to Marqeta...')
      const verified = await client.kyc.verify({
        businessToken: business.token
      })
      if (verified.success) {
        console.log('Success! KYB success for business: ' + business?.token)
      } else {
        console.log('Error! KYB failed for business: ' + business?.token)
        console.log(business)
      }
    } else {
      console.log('Error! Empty business token Id.')
    }
  } else {
    console.log('Error! Unable to get a list of Businesses to test KYB.')
    console.log(businessList)
  }

})()
