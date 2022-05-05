'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockUser = {
    token: '',
    firstName: 'Ipsumi4',
    lastName: 'Lorem',
    email: 'ipsum.lorem9@mailinator.com',
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

  if (listA?.body?.isMore && Array.isArray(listA?.body?.data)) {
    console.log(`Success! ${listA.body!.count} Users were retrieved.`)

    if (listA.body.data[0].token) {
      const foundUserA = await client.user.byTokenId(listA.body.data[0].token)

      if (foundUserA && foundUserA?.body?.token) {
        console.log('Success! Able to get Marqeta User by token id: ' +
          foundUserA.body.token)
        console.log('updating User...')
        const orgNameA = foundUserA.body.firstName
        let upUserA

        if (foundUserA.body.firstName) {
          foundUserA.body.firstName += Math.floor(Math.random() * 100) + 1
          upUserA = await client.user.update(foundUserA.body)
        }

        if (upUserA?.body?.token) {
          console.log('Success! The User account name was updated from "' +
            orgNameA + '" to "' + upUserA.body?.firstName + '"')
        } else {
          console.log('Error! Unable to update the User account')
          console.log(upUserA)
        }

      } else {
        console.log('Error! Unable to get a Marqeta User by token id')
        console.log(foundUserA.body)
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

  if (newA?.success && newA?.body?.token) {
    console.log('Success! The User account with name "' +
        newA.body?.firstName + ' ' + newA.body?.lastName + '" was created ' +
        'with token: ' + newA.body?.token)

    console.log('getting User by token id...')
    const foundUserB = await client.user.byTokenId(newA.body.token)

    if (foundUserB && foundUserB?.body?.token) {
      console.log('Success! Able to get Marqeta User by token id: ' +
          foundUserB.body.token)
      console.log('updating User...')
      const orgNameB = foundUserB.body.firstName
      let upUserB

      if (foundUserB.body.firstName) {
        foundUserB.body.firstName += Math.floor(Math.random() * 100) + 1
        upUserB = await client.user.update(foundUserB.body)
      }

      if (upUserB?.body?.token) {
        console.log('Success! The User account name was updated from "' +
            orgNameB + '" to "' + upUserB.body?.firstName + '"')
      } else {
        console.log('Error! Unable to update the User account')
        console.log(upUserB)
      }

    } else {
      console.log('Error! Unable to get a Marqeta User by token id')
      console.log(foundUserB.body)
    }

  } else {
    console.log('Error! Unable to create the User account')
    console.log(mockUser)
  }

  console.log('testing User search...')
  const { email, ...searchFields } = mockUser // eslint-disable-line
  const userExists = await client.user.search(searchFields)

  if (userExists?.body?.count) {
    console.log('Success! The User with email "' +
      mockUser.email + '" was found using search.')
  } else {
    console.log('Error! search failed to find the User account')
    console.log(mockUser)
  }

})()
