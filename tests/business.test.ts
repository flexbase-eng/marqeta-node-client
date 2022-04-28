'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting list of Businesses...')
  const one = await client.business.list()
  if (one?.success && one.body?.isMore) {
    console.log(`Success! A list ${one?.body!.count} Businesses were retrieved: `)
  }
  else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(one)
  }
  console.log('getting list of unknown Businesses with search parameter: "{ businessNameDba:xyz }"...')
  const twoA = await client.business.list({ businessNameDba:'xyz' })
  if (twoA?.success && twoA.body?.isMore) {
    console.log(`Success! A list ${twoA?.body!.count} Businesses were retrieved: `)
  }
  else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(twoA)
  }
  
  console.log('creating a Business account...')
  const twoB = await client.business.create({
    business: {
      businessNameLegal: 'Zimco INC',
      businessNameDba: 'zim inc',
      incorporation: {
        stateOfIncorporation: 'GA',
        incorporationType: 'CORPORATION'
      },
      proprietorOrOfficer: {
        firstName: '',
        lastName: '',
        home: {
          address1: '106 Main St.',
          address2: '',
          city: 'Atlanta',
          state: 'GA',
          postalCode: '30345',
          country: 'USA'
        }
      },
      identifications: [
        {
          type: 'BUSINESS_TAX_ID',
          value: '921225677'
        }
      ],
    }
  })
  if (twoB?.success && twoB.body?.token) {
    console.log(`Success! The Business account ${twoB?.body?.businessNameLegal} was created with token: ${twoB?.body?.token}`)
  }
  else {
    console.log('Error! Unable to create Businesses account.')
    console.log(twoB)
  }
})()
