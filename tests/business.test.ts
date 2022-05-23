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
  if (list.business?.isMore) {
    console.log(`Success! ${list.business!.count} Businesses were retrieved.`)
    const lstItem1 = list?.business?.data?.pop()

    if (lstItem1?.token) {
      console.log(`getting Business account by id: ${lstItem1.token}`)
      const fouA = await client.business.byTokenId(lstItem1.token)

      if (fouA?.business?.token) {
        console.log('Success! The Business account was found by id: ' +
            JSON.stringify(fouA.business.token))
        console.log('updating Business...')
        const orgNameA = fouA.business.businessNameLegal
        let upA

        if (fouA.business?.businessNameLegal) {
          fouA.business.businessNameLegal += Math.floor(Math.random() * 100) + 1
          upA = await client.business.update(fouA.business)
        }

        if (upA?.business?.token) {
          console.log('Success! The Business account name was updated from "' +
              orgNameA + '" to "' + upA.business?.businessNameLegal + '"')
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

  if (newA?.success && newA?.business?.token) {
    console.log('Success! The Business account "' +
      newA.business?.businessNameLegal +
      '" was created with token: ' + newA.business?.token)
    console.log('getting Business account by id: ' + newA.business?.token)
    const fouB = await client.business.byTokenId(newA.business?.token)

    if (fouB.success && fouB?.business?.token) {
      console.log('Success! The Business account "' +
        newA.business?.businessNameLegal + '" was found with Business id: ' +
        newA?.business?.token)
      console.log('updating Business...')
      const orgNameB = fouB.business.businessNameLegal
      let upB

      if (fouB.business.businessNameLegal) {
        fouB.business.businessNameLegal += Math.floor(Math.random() * 100) + 1
        upB = await client.business.update(fouB.business)
      }

      if (upB?.business?.token) {
        console.log('Success! The Business account name was updated from "' +
          orgNameB + '" to "' + upB.business?.businessNameLegal + '"')
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
  if (businesses.business?.isMore) {
    listItem = businesses?.business?.data?.pop()
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
      if (trans?.business?.token) {
        console.log('Success! The Business was transitioned to status: "' +
          trans.business.status + '"')
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
  if (trans?.business?.token) {
    let getTrans
    getTrans = await client.business.getTransition(
      trans?.business?.token
    )
    if (getTrans?.business?.token) {
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

  console.log('testing list Business transitions by token Id...')
  if (listItem?.token) {
    let listTrans
    listTrans = await client.business.listTransition({ ...listItem })
    if (listTrans?.success && listTrans?.business?.count) {
      console.log('Success! We were able to get a list of Business ' +
        'transitions.')
    } else {
      console.log('Error! We were unable to get a list of Business ' +
        'transitions.')
      console.log(listTrans)
    }
  } else {
    console.log('Error! Unable to get list of Business transition statuses ' +
      'because the Business token Id is empty.')
    console.log(listItem)
  }

  console.log('testing list one Business transitions by token Id...')
  if (listItem?.token) {
    let listTrans
    listTrans = await client.business.listTransition({ ...listItem, count: 1 })
    if (listTrans?.success && listTrans?.business?.count) {
      console.log('Success! We were able to get a list of one Business ' +
        'transitions.')
    } else {
      console.log('Error! We were unable to get a list of one Business ' +
        'transitions.')
      console.log(listTrans)
    }
  } else {
    console.log('Error! Unable to get list of Business transition statuses ' +
      'because the Business token Id is empty.')
    console.log(listItem)
  }

})()
