'use strict'

import { Marqeta } from '../src'

(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockMerchantGroup = {
    token: '',
    name: 'TestMerchantGroup.' + Math.floor(Math.random() * 50) + 1,
    mids: ['123456789012345', '000123456789012', '123456789012'],
    active: true
  }

  console.log('creating a Merchant Group...')
  const merchantGroup = await client.merchantGroup.create(mockMerchantGroup)

  if (merchantGroup?.success) {
    console.log('Success! Merchant Group created.')
  } else {
    console.log('Error! Unable to create Merchant Group.')
    console.log(merchantGroup)
  }

  console.log('getting a Merchant Group by token Id...')

  let foundMerchantGroup
  if (merchantGroup?.merchantGroup?.token) {
    foundMerchantGroup = await client.merchantGroup.byTokenId(
      merchantGroup?.merchantGroup?.token
    )

    if (foundMerchantGroup?.success) {
      console.log('Success! Merchant Group found by token Id.')
    } else {
      console.log('Error! Merchant Group not found by token Id.')
      console.log(foundMerchantGroup)
    }
  } else {
    console.log('Error! Empty Merchant Group token Id.')
    console.log(merchantGroup)
  }

  console.log('getting a list of Merchant Groups...')
  const list = await client.merchantGroup.list()

  if (list?.merchantGroups?.count
    && Array.isArray(list?.merchantGroups?.data)) {
    console.log('Success! ' + list.merchantGroups!.count + ' Merchant Groups' +
      ' were retrieved.')
  } else {
    console.log('Error! ' + list.merchantGroups!.count + ' Merchant Groups' +
      ' were retrieved.')
    console.log(JSON.stringify(list))
  }

  console.log('updating a Merchant Group...')

  if (foundMerchantGroup?.merchantGroup?.token) {
    let originalName

    if (foundMerchantGroup?.merchantGroup?.token
      && foundMerchantGroup?.merchantGroup?.name) {
      originalName = foundMerchantGroup?.merchantGroup.name
    }
    foundMerchantGroup.merchantGroup.name =
      'UpdatedMerchantGroup.' + Math.floor(Math.random() * 50) + 1

    const updatedGroup = await client.merchantGroup.update(
      foundMerchantGroup.merchantGroup
    )

    if (updatedGroup?.success &&
      updatedGroup?.merchantGroup?.name != originalName
      && originalName != undefined) {
      console.log('Success! Merchant Group name updated from "' + originalName +
        '" to: "' + updatedGroup?.merchantGroup?.name + '"')
    } else {
      console.log('Error! Unable to update Merchant Group name.')
      console.log(updatedGroup)
    }
  } else {
    console.log('Error! Empty Merchant Group token Id.')
    console.log(merchantGroup)
  }

})()
