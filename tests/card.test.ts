'use strict'

import { Marqeta } from '../src'

(async () => {

  const mockCard = {
    cardProductToken: '',
    userToken: '',
  }
  console.log('initializing Marqeta Client...')
  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  if (client) {
    console.log('Success! Client initialized')
    console.log('getting a list of Marqeta Users...')
    const users = await client.user.list()

    if (
      users?.userList?.isMore
      && users?.userList?.count > 0
      && Array.isArray(users?.userList?.data)
    ) {
      console.log('getting the User Marqeta Card Products...')
      const products = await client.cardProduct.list()
      const user = users?.userList?.data.pop()
      let newCard
      if (products?.cardProducts?.isMore && Array.isArray(products?.cardProducts?.data)) {
        const product = products?.cardProducts?.data.pop()

        if (user?.token && product?.token) {
          mockCard.userToken = user.token
          mockCard.cardProductToken = product.token
          newCard = await client.card.create(mockCard)
          if (newCard.success && newCard?.card?.token) {
            console.log('Success! New Card created.')
          } else {
            console.log('Error! Unable to create a new Card.')
            console.log(newCard)
          }
        }
      }

      console.log('retrieving new Card by barcode...')
      if (newCard?.card?.barcode) {
        const foundCard = await client.card.byBarcode(newCard?.card.barcode)
        if (foundCard?.card?.token) {
          console.log('Success! New Card retrieved by barcode.')
        } else {
          console.log('Error! Unable to retrieve the new Card by barcode.')
        }
      } else {
        console.log('Error! Unable to retrieve the new Card by barcode. ' +
          'The Card does not exist')
        console.log(users)
      }

      console.log('updating the new Marqeta Card...')
      let updatedCard
      if (newCard?.card?.barcode) {

        if (newCard && newCard?.card?.expiration && newCard?.card?.token) {
          newCard.card.expiration = newCard.card.expiration + 1
          const originalMeta = newCard.card?.metadata
          updatedCard = await client.card.update(
            newCard.card.token,
            { metadata: { name_1: 'ipsum' } }
          )

          if (updatedCard?.card?.token) {
            console.log('Success! The new Card metadata was updated from "' +
              JSON.stringify(originalMeta) + '" to "' +
              JSON.stringify(updatedCard.card?.metadata) + '"')
          } else {
            console.log('Error! Unable to update the new Marqeta Card')
            console.log(newCard)
          }
        } else {
          console.log('Error! Unable to update the new Marqeta Card as the ' +
          ' expiration date is missing.')
          console.log(newCard)
        }
      } else {
        console.log('Error! Card barcode empty, cannot update Card')
        console.log(newCard)
      }

      console.log('getting a list of Marqeta Cards by User token Id...')
      if (user?.token) {
        const userCards = await client.card.listByUser(user?.token)
        if (userCards?.success && userCards?.cards?.count) {
          console.log('Success! Found Marqeta Cards by User token and ' +
            '{count:1} search option')
        } else {
          console.log('Error! Unable to find any Marqeta Cards by User token ' +
            ' and {count:1} search option')
          console.log(userCards)
        }
      } else {
        console.log('Error! User token empty, cannot get a list of Cards')
        console.log(user)
      }

      console.log('getting Card by Token Id...')
      if (newCard?.card?.token) {
        const byToken = await client.card.retrieve(newCard.card.token)
        if (byToken?.success) {
          console.log('Success! Found a Marqeta Card by a Card token Id')
        } else {
          console.log('Error! Unable to find a Marqeta Card by a Card token Id')
          console.log(byToken)
        }
      } else {
        console.log('Error! Card token empty, cannot get a Card by token Id')
        console.log(user)
      }

    } else {
      console.log('Error! Unable to get a list of Marqeta Users')
      console.log(users)
    }

  } else {
    console.log('Error! Could not create a Client instance')
  }
})()
