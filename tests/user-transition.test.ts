'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  let testUser, trans
  const listA = await client.user.list({ count: 1 })

  if (listA?.userList?.count && Array.isArray(listA?.userList?.data)) {
    console.log(`Success! ${listA.userList!.count} Users were retrieved.`)
    testUser = listA.userList.data.pop()
  } else {
    console.log('Error! Unable to get a list of Users.')
    console.log(listA)
  }
  console.log('testing User transition...')

  if (testUser?.token) {
    const state = {
      status: 'UNVERIFIED',
      reasonCode: '02',
      channel: 'API',
      userToken: testUser.token,
    }
    trans = await client.userTransition.create(state)

    if (trans?.transition?.token) {
      console.log('Success! The User was transitioned to status: "' +
        trans.transition.status)
    } else {
      console.log('Error! Unable to transition the User status.')
      console.log(trans)
    }
  } else {
    console.log('Error! Empty Marqeta User token Id.')
    console.log(testUser)
  }

  console.log('testing get User transition by token Id...')

  if (trans?.transition?.token) {
    let getTrans
    getTrans = await client.userTransition.retrieve(trans?.transition?.token)

    if (getTrans?.transition?.token) {
      console.log('Success! We were able to get the Transition status.')
    } else {
      console.log('Error! We were unable to get the Transition status.')
      console.log(getTrans)
    }
  } else {
    console.log('Error! Unable to get transition because the Transition ' +
      'token is empty.')
    console.log(listA)
  }

  console.log('testing list User transitions by User token Id...')
  if (testUser?.token) {
    let listTrans
    listTrans = await client.userTransition.list({
      token: testUser.token,
      count: 2,
    })
    console.log(`${JSON.stringify(listTrans)}`)

    if (listTrans?.success && listTrans?.transitionList?.count) {
      console.log('Success! We were able to get a list of User transitions.')
    } else {
      console.log('Error! We were unable to get a list of User transitions.')
      console.log(listTrans)
    }
  } else {
    console.log('Error! Unable to get User transition because the User ' +
      'token is empty.')
    console.log(listA)
  }

  console.log('testing list one User transitions by token Id...')
  if (testUser?.token) {
    let listTransOne
    listTransOne = await client.userTransition.list({
      ...testUser,
      count: 1,
    })
    if (listTransOne?.success
      && listTransOne?.transitionList?.count && listTransOne.transitionList) {
      console.log('Success! We were able to get a list of one User transitions.')
    } else {
      console.log('Error! We were unable to get a list of one User ' +
        'transitions.')
      console.log(listTransOne)
    }
  } else {
    console.log('Error! Unable to get list of User transition statuses ' +
      'because the User token Id is empty.')
    console.log(testUser)
  }

})()
