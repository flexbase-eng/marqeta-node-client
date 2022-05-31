'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const emailNum = Math.floor(Math.random() * 50) + 1
  const mockUser = {
    token: '',
    firstName: 'Ipsumi4',
    lastName: 'Lorem',
    email: `ipsum.lorem${emailNum}@mailinator.com`,
    address1: '100 Main Street',
    city: 'Canton',
    state: 'GA',
    postalCode: '30114-7531',
    country: 'US',
    birthDate: '1974-01-15',
    phone: '555-867-5309'
  }

  console.log('getting list of e User...')
  const listA = await client.user.list({ count: 1 })

  if (listA?.userList?.isMore && Array.isArray(listA?.userList?.data)) {
    console.log(`Success! ${listA.userList!.count} Users were retrieved.`)

    if (listA.userList.data[0].token) {
      console.log('getting User by token Id...')
      const foundUserA = await client.user.byTokenId(listA.userList.data[0].token)

      if (foundUserA && foundUserA?.user?.token) {
        console.log('Success! Able to get Marqeta User by token id: ' +
          foundUserA.user.token)
        console.log('updating User...')
        const orgNameA = foundUserA.user.firstName
        let upUserA

        if (foundUserA.user.firstName) {
          foundUserA.user.firstName += Math.floor(Math.random() * 100) + 1
          foundUserA.user.firstName = foundUserA.user.firstName.slice(0, 20)
          upUserA = await client.user.update(foundUserA.user)
        }

        if (upUserA?.user?.token) {
          console.log('Success! The User account name was updated from "' +
            orgNameA + '" to "' + upUserA.user?.firstName + '"')
        } else {
          console.log('Error! Unable to update the User account')
          console.log(upUserA)
        }

      } else {
        console.log('Error! Unable to get a Marqeta User by token id')
        console.log(foundUserA.user)
      }
    } else {
      console.log('Error! Unable to test get user by token id, no user ' +
        'token found.')
      console.log(listA)
    }

  } else {
    console.log('Error! Unable to get a list of 1 User using count parameter.')
    console.log(listA)
  }

  console.log('testing creating User...')

  const newA = await client.user.create(mockUser)
  if (newA?.success && newA?.user?.token) {
    console.log('Success! The User account with name "' +
        newA.user?.firstName + ' ' + newA.user?.lastName + '" was created ' +
        'with token: ' + newA.user?.token)

    console.log('getting User by token id...')
    const foundUserB = await client.user.byTokenId(newA.user.token)

    if (foundUserB && foundUserB?.user?.token) {
      console.log('Success! Able to get Marqeta User by token id: ' +
          foundUserB.user.token)
      console.log('updating User...')
      const orgNameB = foundUserB.user.firstName
      let upUserB

      if (foundUserB.user.firstName) {
        foundUserB.user.firstName += Math.floor(Math.random() * 100) + 1
        upUserB = await client.user.update(foundUserB.user)
      }

      if (upUserB?.user?.token) {
        console.log('Success! The User account name was updated from "' +
            orgNameB + '" to "' + upUserB.user?.firstName + '"')
      } else {
        console.log('Error! Unable to update the User account')
        console.log(upUserB)
      }

    } else {
      console.log('Error! Unable to get a Marqeta User by token id')
      console.log(foundUserB.user)
    }

  } else {
    console.log('Error! Unable to create the User account')
    console.log(mockUser)
  }
  console.log('testing User search...')
  const { email, ...searchFields } = mockUser // eslint-disable-line
  const userExists = await client.user.search(searchFields)

  if (userExists?.user?.count) {
    console.log('Success! The User with email "' +
      mockUser.email + '" was found using search.')
  } else {
    console.log('Error! search failed to find the User account')
    console.log(mockUser)
  }

  console.log('testing User transition...')
  let trans
  let testUser
  if (listA?.userList?.isMore && Array.isArray(listA?.userList?.data)) {
    testUser = listA.userList.data.pop()
    if (testUser?.token && testUser?.status) {
      //const originalStatus = testUser.status
      const state = {
        status: 'UNVERIFIED',
        reasonCode: '02',
        channel: 'API',
        userToken: testUser.token,
      }
      trans = await client.userTransition.transition(state)

      if (trans?.transition?.token) {
        console.log('Success! The User was transitioned to status: "' +
          trans.transition.status)
      } else {
        console.log('Error! Unable to transition the User status.')
        console.log(trans)
      }
    }
  } else {
    console.log('Error! Unable to transition empty User account.')
    console.log(listA)
  }

  console.log('testing get User transition by token Id...')
  if (trans?.transition?.token) {
    let getTrans
    getTrans = await client.userTransition.getTransition(trans?.transition?.token)

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
    listTrans = await client.userTransition.listTransition({ ...testUser })

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
    listTransOne = await client.userTransition.listTransition({
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
