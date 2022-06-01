'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const businesses = await client.business.list()

  let listItem
  let trans
  if (businesses.businesses?.isMore) {
    listItem = businesses?.businesses?.data?.pop()
    if (listItem?.token) {
      console.log('transition Business status to Active...')
      if (listItem?.token && listItem?.status) {
        const state = {
          status: 'ACTIVE',
          reasonCode: '02',
          channel: 'API',
          businessToken: listItem.token,
        }
        trans = await client.businessTransition.create(state)
      }
      if (trans?.transition?.token) {
        console.log('Success! The Business was transitioned to status: "' +
          trans.transition.status + '"')
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
    console.log(businesses)
  }

  console.log('testing get Business transition by token Id...')
  if (trans?.transition?.token) {
    let getTrans
    getTrans = await client.businessTransition.byTokenId(
      trans?.transition?.token
    )
    if (getTrans?.transition?.token) {
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
    listTrans = await client.businessTransition.list({ ...listItem })
    if (listTrans?.success && listTrans?.transitions?.count) {
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
    listTrans = await client.businessTransition.list({ ...listItem, count: 1 })
    if (listTrans?.success && listTrans?.transitions?.count) {
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
