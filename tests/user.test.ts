'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const emailNum = Math.floor(Math.random() * 100) + 1
  const mockUser = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: `jane.doe${emailNum}@company.com`,
    password: 'P@ssw0rd',
    'identifications' : [
      {
        type: 'SSN',
        value: '111234444'
      }
    ],
    birthDate: '1991-01-01T00:00:00.000Z',
    address1: '1234 Grove Street',
    city: 'Berkeley',
    state: 'CA',
    country: 'USA',
    postalCode: '94702',
    phone: '5105551212',
    gender: 'F',
    usesParentAccount: false,
    metadata: {
      notificationEmail: 'jane.doe@home.com',
      notificationLanguage: 'spa',
      authenticationQuestion1: 'What was your first job?',
      authenticationQuestion2: 'What make was your first car?',
      authenticationQuestion3: 'What is your favorite color?',
      authenticationAnswer1: 'Cashier',
      authenticationAnswer2: 'Trabant',
      authenticationAnswer3: 'Blue'
    }
  }
  let foundUserA, testUser, upUserA

  console.log('getting list of Users...')
  const listA = await client.user.list({ count: 1 })

  if (listA?.userList?.count && Array.isArray(listA?.userList?.data)) {
    console.log(`Success! ${listA.userList!.count} Users were retrieved.`)
    testUser = listA.userList.data.pop()

    if (testUser?.token) {
      console.log('retrieving User by token Id...')
      foundUserA = await client.user.retrieve(testUser.token)

      if (foundUserA?.user?.token) {
        console.log('Success! Marqeta User found by token id: ' +
          foundUserA.user.token)

      } else {
        console.log('Error! Unable to get a Marqeta User by token id')
        console.log(foundUserA.user)
      }
    } else {
      console.log('Error! Empty Marqeta User token Id.')
      console.log(testUser)
    }

  } else {
    console.log('Error! Unable to get a list of 1 User using count parameter.')
    console.log(listA)
  }

  console.log('updating User...')

  if (foundUserA?.user?.firstName) {
    const orgNameA = foundUserA.user.firstName
    foundUserA.user.firstName += Math.floor(Math.random() * 100) + 1
    foundUserA.user.firstName = foundUserA.user.firstName.slice(0, 20)
    upUserA = await client.user.update(foundUserA.user)

    if (upUserA?.user?.token) {
      console.log('Success! The User account name was updated from "' +
        orgNameA + '" to "' + upUserA.user?.firstName + '"')
    } else {
      console.log('Error! Unable to update the User account')
      console.log(upUserA)
    }
  }


  console.log('testing creating User...')

  const newA = await client.user.create(mockUser)
  if (newA?.success && newA?.user?.token) {
    console.log('Success! The User account with name "' +
      newA.user?.firstName + ' ' + newA.user?.lastName + '" was created ' +
      'with token: ' + newA.user?.token)
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
    console.log(userExists)
  }

})()
