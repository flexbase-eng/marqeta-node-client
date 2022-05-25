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
  const mccGroup = await client.mccGroup.create(mockMccGroup)

  if (mccGroup?.success) {
    console.log('Success! MCC Group created.')
  } else {
    console.log('Error! Unable to create MCC Group.')
    console.log(mccGroup)
  }

})()
