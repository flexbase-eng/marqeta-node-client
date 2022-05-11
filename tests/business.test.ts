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

  console.log('getting a list of Businesses...')
  const list = await client.business.list()
  if (list.body?.isMore) {
    console.log(`Success! ${list.body!.count} Businesses were retrieved.`)
    const lstItem1 = list?.body?.data?.pop()

    if (lstItem1?.token) {
      console.log(`getting Business account by id: ${lstItem1.token}`)
      const fouA = await client.business.byTokenId(lstItem1.token)

      if (fouA?.body?.token) {
        console.log('Success! The Business account was found by id: ' +
            JSON.stringify(fouA.body.token))
        console.log('updating Business...')
        const orgNameA = fouA.body.businessNameLegal
        let upA

        if (fouA.body?.businessNameLegal) {
          fouA.body.businessNameLegal += Math.floor(Math.random() * 100) + 1
          upA = await client.business.update(fouA.body)
        }

        if (upA?.body?.token) {
          console.log('Success! The Business account name was updated from "' +
              orgNameA + '" to "' + upA.body?.businessNameLegal + '"')
        } else {
          console.log('Error! Unable to update the Business account')
          console.log(upA)
        }
      } else {
        console.log('Error! The Business account was not found by id')
        console.log(fouA)
      }

    } else {
      console.log('Error! The Business account found is missing a token id.')
      console.log(lstItem1)
    }
  } else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(list)
  }

  console.log('creating Business account')
  const newA = await client.business.create(mockBusiness)

  if (newA?.success && newA?.body?.token) {
    console.log('Success! The Business account "' +
      newA.body?.businessNameLegal +
      '" was created with token: ' + newA.body?.token)
    console.log('getting Business account by id: ' + newA.body?.token)
    const fouB = await client.business.byTokenId(newA.body?.token)

    if (fouB.success && fouB?.body?.token) {
      console.log('Success! The Business account "' +
        newA.body?.businessNameLegal + '" was found with Business id: ' +
        newA?.body?.token)
      console.log('updating Business...')
      const orgNameB = fouB.body.businessNameLegal
      let upB

      if (fouB.body.businessNameLegal) {
        fouB.body.businessNameLegal += Math.floor(Math.random() * 100) + 1
        upB = await client.business.update(fouB.body)
      }

      if (upB?.body?.token) {
        console.log('Success! The Business account name was updated from "' +
          orgNameB + '" to "' + upB.body?.businessNameLegal + '"')
      } else {
        console.log('Error! Unable to update the Business account')
        console.log(upB)
      }
    } else {
      console.log('Error! Unable to get Businesses by id.')
      console.log(fouB)
    }

  } else {
    console.log('Error! Unable to create a Businesses account.')
    console.log(newA)
  }

  const businesses = await client.business.list()

  let listItem
  let trans
  if (businesses.body?.isMore) {
    listItem = businesses?.body?.data?.pop()
    if (listItem?.token) {
      console.log('transition Business status to Active...')
      if (listItem?.token && listItem?.status) {
        const state = {
          status: 'ACTIVE',
          reasonCode: '02',
          channel: 'API',
          businessToken: listItem.token,
        }
        trans = await client.business.transition(state)
      }
      if (trans?.body?.token) {
        console.log('Success! The Business was transitioned to status: "' +
          trans.body.status + '"')
      } else {
        console.log('Error! Unable to transition the Business status.')
        console.log(trans)
      }
    } else {
      console.log('Error! The Business account is missing a token id.')
      console.log(listItem)
    }

  } else {
    console.log('Error! Unable to get a list of Businesses.')
    console.log(list)
  }

  console.log('testing get Business transition by token Id...')
  if (trans?.body?.token) {
    let getTrans
    getTrans = await client.business.getTransition(
      trans?.body?.token
    )
    if (getTrans?.body?.token) {
      console.log('Success! We were able to get the Business ' +
          'transition status.')
    } else {
      console.log('Error! We were unable to get the Business transition ' +
          'status.')
      console.log(getTrans)
    }
  } else {
    console.log('Error! Unable to get Business transition because the ' +
      'Business account is empty.')
    console.log(businesses)
  }

})()
