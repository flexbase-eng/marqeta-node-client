'use strict'

import { Marqeta } from '../src'

(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockMccGroup = {
    token: '',
    name: 'TestMccGroup.' + Math.floor(Math.random() * 50) + 1,
    mccs: ['0123', '2224-2230', '3876'],
    active: true,
    config: {
      authorizationControls: {
        holdIncrease: {
          type: 'PERCENT',
          value: 20
        },
        holdExpirationDays: 2
      }
    }
  }
  console.log('creating a MCC Group...')
  const result = await client.mccGroup.create(mockMccGroup)

  if (result?.success) {
    console.log('Success! MCC Group created.')
  } else {
    console.log('Error! Unable to create MCC Group.')
    console.log(result)
  }

  console.log('getting MCC Group by token Id...')

  if (result?.mccGroup?.token) {
    const found = await client.mccGroup.get(result.mccGroup.token)
    if (found?.success) {
      console.log('Success! MCC Group found.')
    } else {
      console.log('Error! Unable to find MCC Group.')
      console.log(found)
    }
  }

  console.log('getting list of MCC Groups...')

  const list = await client.mccGroup.list({ startIndex: 0 })

  if (list?.success) {
    console.log('Success! List of MCC Groups retrieved.')
  } else {
    console.log('Error! Unable to get a list of MCC Groups.')
    console.log(list)
  }


})()
