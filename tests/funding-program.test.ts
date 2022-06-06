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

  console.log('getting list of one Marqeta user...')
  const fund = await client.fundingProgram.create(mockFunding)

  if (fund.success) {
    console.log('Success! Program Funding source created.')
  } else {
    console.log('Error! Program Funding source not created.')
    console.log(fund)
  }

  if (fund?.funding?.token) {
    const found = await client.fundingProgram.retrieve(fund.funding.token)

    if (found.success) {
      console.log('Success! Program Funding source found.')
    } else {
      console.log('Error! Program Funding source not found.')
      console.log(found)
    }

  }

})()
