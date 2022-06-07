'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockGroup = {
    name: 'account-hoder-group-test-kyb',
  }

  console.log('getting list of one Marqeta user...')
  const group = await client.accountHolderGroup.create(mockGroup)

  if (group.success) {
    console.log('Success! Account Holder Group created.')
  } else {
    console.log('Error! Account Holder Group not created.')
    console.log(group)
  }

})()
