'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockFunding = {
    name: 'funding-test',
    active: true,
  }

  let found, updated

  console.log('getting list of one Marqeta user...')
  const fund = await client.fundingProgram.create(mockFunding)

  if (fund.success) {
    console.log('Success! Program Funding source created.')
  } else {
    console.log('Error! Program Funding source not created.')
    console.log(fund)
  }

  if (fund?.funding?.token) {
    found = await client.fundingProgram.retrieve(fund.funding.token)

    if (found.success) {
      console.log('Success! Program Funding source found.')
    } else {
      console.log('Error! Program Funding source not found.')
      console.log(found)
    }
  } else {
    console.log('Error! Empty funding program token.')
    console.log(fund)
  }

  if (found?.funding?.name && found?.funding?.token) {
    const originalName = found.funding.name
    found.funding.name = 'updated-funding-test'
    updated = await client.fundingProgram.update(found.funding)

    if (updated.success && updated?.funding?.name) {
      console.log('Success! Program Funding source name updated from "' +
        originalName + '" to "' + updated.funding.name + '"')
    } else {
      console.log('Error! Program Funding source not updated.')
      console.log(updated)
    }
  }

})()
