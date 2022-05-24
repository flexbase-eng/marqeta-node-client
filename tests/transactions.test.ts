'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting a user ...')
  const userList = await client.user.list({ count: 1 })

  let user
  if (userList?.body?.isMore && Array.isArray(userList?.body?.data)) {
    user = userList.body.data.pop()
    if (user?.token) {
      console.log('getting user transactions by user token Id...')
      const transactions = await client.transactions.list({
        userToken: user.token,
        count: 1
      })
      if (transactions.success) {
        console.log('Success! A list of transactions was retrieved for user: '
          + user?.token)
      } else {
        console.log('Error! A list of transactions was retrieved for user: '
          + user?.token)
        console.log(transactions)
      }
    } else {
      console.log('Error! Empty user token Id.')
    }
  } else {
    console.log('Error! Unable to get a list of users.')
    console.log(userList)
  }

  console.log('getting users...')
  const users = await client.user.list()

  let newCard
  let getTransaction
  if (users?.body?.isMore && Array.isArray(users?.body?.data)) {
    const products = await client.cardProduct.list()
    const user = users?.body?.data.pop()

    if (products?.body?.isMore && Array.isArray(products?.body?.data)) {
      const product = products?.body?.data.pop()

      if (user?.token && product?.token) {
        console.log('creating card for user...')
        newCard = await client.card.create({
          userToken: user.token,
          cardProductToken: product.token,
        })
      }
      if (newCard?.card?.token) {
        console.log('simulating a card transaction...')
        const response = await client.fire('POST',
          'simulate/authorization',
          undefined,
          {
            amount: '10',
            mid: '1234567890',
            cardToken: newCard.card.token
          }
        )
        if (response?.payload?.transaction?.token) {
          getTransaction = await client.transactions.byTokenId(
            response.payload.transaction.token
          )
          if (getTransaction?.success && getTransaction?.transaction?.token) {
            console.log('Success! Retrieved a transaction by token Id')
          } else {
            console.log('Error! Unable to retrieve a transaction by token Id')
            console.log(getTransaction)
          }
        } else {
          console.log('Error! Empty Transaction token Id')
          console.log(response)
        }
      } else {
        console.log('Error! Empty new card token Id')
        console.log(newCard)
      }
    }
  } else {
    console.log('Error! Unable to get a list of users.')
    console.log(userList)
  }

  console.log('getting related transactions ...')
  if (getTransaction?.success && getTransaction?.transaction?.token) {
    const related = await client.transactions.related({
      token: getTransaction.transaction.token,
      count: 1
    })
    if (related.success && Array.isArray(related?.transactions?.data)) {
      console.log('Success! Related transactions retrieved by token Id')
    } else {
      console.log('Error! Unable to retrieve related transactions by token Id')
      console.log(related)
    }
  } else {
    console.log('Error! Empty Transaction token Id')
    console.log(getTransaction)
  }

})()
