'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockSource = {
    name: 'funding_gate_way_test_' + Math.floor(65536 * 100) + 1,
    url: 'https://www.ipsumlorem.com',
    token: '',
    basicAuthUsername: 'ipsum_lorem',
    basicAuthPassword: 'abbykj26stringzIl2-Mzk' + Math.floor(65536 * 100) + 1,
    customHeader: { 'X_header_name' : 'x_header_value' },
  }

  console.log('creating funding gateway source...')
  const funding = await client.fundingGatewayApi.create(mockSource)
  mockSource.basicAuthPassword = mockSource.basicAuthPassword.slice(0, 20)
  if (funding.success && funding?.body?.token) {
    console.log('Success! Funding gateway source created.')
  } else {
    console.log('Error! Unable to create a funding gateway source.')
    console.log(funding)
  }

})()

