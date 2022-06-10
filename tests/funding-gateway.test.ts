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
  console.log(`${JSON.stringify(mockSource)}`)
  const funding = await client.fundingGatewayApi.create(mockSource)
  console.log(`${JSON.stringify(funding)}`)
  mockSource.basicAuthPassword = mockSource.basicAuthPassword.slice(0, 20)
  if (funding.success && funding?.fundingGateway?.token) {
    console.log('Success! Funding gateway source created.')
  } else {
    console.log('Error! Unable to create a funding gateway source.')
    console.log(funding)
  }

  console.log('retrieving funding gateway source...')
  let found
  if (funding?.fundingGateway?.token) {
    found = await client.fundingGatewayApi.retrieve(funding?.fundingGateway?.token)
    console.log(`${JSON.stringify(found)}`)
    if (found.success && found?.fundingGateway?.token) {
      console.log('Success! Funding gateway retrieved.')
    } else {
      console.log('Error! Unable to retrieve a funding gateway source.')
      console.log(found)
    }
  } else {
    console.log('Error! Unable to retrieve a funding gateway source using an ' +
      ' empty token Id.')
    console.log(funding)
  }
  console.log('updating funding gateway source active status...')
  if (found?.fundingGateway?.token && found?.fundingGateway?.name) {
    const foundName = found.fundingGateway.name
    found.fundingGateway.name = 'updated_name_' + Math.floor(65536 * 100) + 1,
    found.fundingGateway.name = found.fundingGateway.name.slice(0, 40)
    console.log(`${JSON.stringify(found)}`)
    const updated = await client.fundingGatewayApi.update(found.fundingGateway)
    console.log(`${JSON.stringify(updated)}`)
    if (updated.success && updated?.fundingGateway?.token) {
      console.log('Success! Funding gateway name changed from "' + foundName +
        '" to "' + found.fundingGateway.name + '"')
    } else {
      console.log('Error! Unable to update funding gateway source.')
      console.log(updated)
    }
  } else {
    console.log('Error! Unable to update funding gateway source using an ' +
      'empty token Id.')
    console.log(found)
  }

})()
