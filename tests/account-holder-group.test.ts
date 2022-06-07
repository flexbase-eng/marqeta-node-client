'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockGroup = {
    name: 'account-holder-group-test-kyb',
  }

  console.log('getting list of one Marqeta user...')
  const group = await client.accountHolderGroup.create(mockGroup)

  if (group.success) {
    console.log('Success! Account Holder Group created.')
  } else {
    console.log('Error! Account Holder Group not created.')
    console.log(group)
  }

  let found
  if (group?.group?.token) {

    found = await client.accountHolderGroup.retrieve(group.group.token)

    if (found.success) {
      console.log('Success! Account Holder group found.')
    } else {
      console.log('Error! Account Holder group not found.')
      console.log(found)
    }
  } else {
    console.log('Error! Empty Account Holder group token.')
    console.log(group)
  }

  if (found?.group?.name && found?.group?.token) {
    const originalName = found.group.name
    found.group.name = 'updated-accountholder-group-test-kyb'
    const updated = await client.accountHolderGroup.update(found.group)

    if (updated.success && updated?.group?.name) {
      console.log('Success! Account Holder group name updated from "' +
        originalName + '" to "' + updated.group.name + '"')
    } else {
      console.log('Error! Account Holder group not updated.')
      console.log(updated)
    }
  }

})()
