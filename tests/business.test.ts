'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockBusiness = {
    businessNameLegal: 'AcmeZinc INC',
    businessNameDba: 'zinc inc',
    incorporation: {
      stateOfIncorporation: 'LA',
      incorporationType: 'CORPORATION'
    },
    proprietorOrOfficer: {
      firstName: '',
      lastName: '',
      home: {
        address1: '106 Main St.',
        address2: '',
        city: 'Opelousas',
        state: 'LA',
        postalCode: '70570',
        country: 'USA'
      }
    },
    identifications: [
      {
        type: 'BUSINESS_TAX_ID',
        value: '901721634'
      }
    ],
  }


  console.log('creating Business account')
  const newA = await client.business.create(mockBusiness)

  if (newA?.success && newA?.business?.token) {
    console.log('Success! The Business account "' +
      newA.business?.businessNameLegal +
      '" was created with token: ' + newA.business?.token)
  } else {
    console.log('Error! Unable to create a Businesses account.')
    console.log(newA)
  }

  console.log('getting a list of Businesses...')
  const list = await client.business.list({ count: 2 })

  if (list.businesses?.count) {
    console.log(`Success! ${list.businesses!.count} Businesses were retrieved.`)
  } else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(list)
  }

  console.log('retrieving Business account by token id...')

  if (newA?.business?.token) {
    console.log(`getting Business account by id: ${newA.business.token}`)
    const fouA = await client.business.retrieve(newA.business.token)

    if (fouA?.business?.token) {
      console.log('Success! The Business account was found by token id: ' +
          JSON.stringify(fouA.business.token))
    } else {
      console.log('Error! Unable to retrieve Business account token id.')
      console.log(fouA)
    }
  } else {
    console.log('Error! Empty Business token id.')
    console.log(newA)
  }

  console.log('updating Business account...')

  if (newA?.business?.token) {
    const orgNameA = newA.business.businessNameLegal
    let upA

    if (newA.business?.businessNameLegal) {
      newA.business.businessNameLegal += Math.floor(
        Math.random() * 100
      ) + 1
      upA = await client.business.update(newA.business)
    }

    if (upA?.business?.token) {
      console.log('Success! The Business account name was updated from "' +
            orgNameA + '" to "' + upA.business?.businessNameLegal + '"')
    } else {
      console.log('Error! Unable to update the Business account')
      console.log(upA)
    }
  } else {
    console.log('Error! Empty Business account token id.')
    console.log(newA)
  }

})()
