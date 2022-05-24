'use strict'

import { Marqeta } from '../src'

(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockMerchantGroup = {
    token: 'test_merchantgroup',
    name: 'Test Merchant Group',
    mids: ['123456789012345', '000123456789012', '123456789012'],
    active: true
  }

  console.log('creating a Merchant Group...')
  const merchantGroup = await client.merchantGroup.create(mockMerchantGroup)

  if (merchantGroup?.success) {
    console.log('Success! Merchant Group created.')
  } else {
    console.log('Error! Unable to create Merchant Group.')
    console.log(merchantGroup)
  }

  console.log('getting a Merchant Group by token Id...')

  let foundMerchantGroup
  if (merchantGroup?.merchantGroup?.token) {
    foundMerchantGroup = await client.merchantGroup.byTokenId(
      merchantGroup?.merchantGroup?.token
    )

    if (foundMerchantGroup?.success) {
      console.log('Success! Merchant Group found by token Id.')
    } else {
      console.log('Error! Merchant Group not found by token Id.')
      console.log(foundMerchantGroup)
    }
  } else {
    console.log('Error! Empty Merchant Group token Id.')
    console.log(merchantGroup)
  }

})()
