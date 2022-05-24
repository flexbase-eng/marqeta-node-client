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

  console.log('getting a user ...')
  const merchantGroup = await client.merchantGroup.create(mockMerchantGroup)

  if (merchantGroup?.success) {
    console.log('Success! Merchant Group created.')
  } else {
    console.log('Error! Unable to create Merchant Group.')
    console.log(merchantGroup)
  }

})()
