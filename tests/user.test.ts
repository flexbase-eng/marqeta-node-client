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
  let foundUserA, testUser, upUserA

  console.log('getting list of Users...')
  const listA = await client.user.list({ count: 1 })

  if (listA?.userList?.count && Array.isArray(listA?.userList?.data)) {
    console.log(`Success! ${listA.userList!.count} Users were retrieved.`)
    testUser = listA.userList.data.pop()

    if (testUser?.token) {
      console.log('getting User by token Id...')
      foundUserA = await client.user.byTokenId(testUser.token)

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
