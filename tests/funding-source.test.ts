'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockSource = {
    token: 'abc',
  }

  console.log('creating funding source...')
  const funding = await client.fundingGatewayApi.create(mockSource)
  if (funding) {
    console.log('Success! Funding source client created.')
  } else {
    console.log('Error! Funding source client not created.')
    console.log(funding)
  }

})()
