import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockCard = {
    cardProductToken: '',
    userToken: '',
  }

  console.log('getting a list of users...')
  const users = await client.user.list()

  let user, newCard, cardTransition
  if (users?.userList?.count && Array.isArray(users?.userList?.data)) {

    console.log('getting Card Products...')
    const products = await client.cardProduct.list()
    user = users?.userList?.data.pop()

    if (products?.cardProducts?.count
      && Array.isArray(products?.cardProducts?.data)) {
      const product = products?.cardProducts?.data.pop()
      console.log('creating new Card...')

      if (user?.token && product?.token) {
        mockCard.userToken = user.token
        mockCard.cardProductToken = product.token
        newCard = await client.card.create(mockCard)

        if (newCard?.card?.token) {
          const state = {
            state: 'ACTIVE',
            reasonCode: '02',
            channel: 'API',
            cardToken: newCard.card.token,
          }
          console.log('transitioning new Card to ACTIVE state...')
          cardTransition = await client.cardTransition.create(state)

          if (cardTransition?.success) {
            console.log('Success! Card transitioned to "ACTIVE" state.')
          } else {
            console.log('Error! Unable to transition card.')
            console.log(cardTransition)
          }
        } else {
          console.log('Error! Unable to create a new Card.')
          console.log(newCard)
        }
      } else {
        console.log('Error! Empty user token.')
        console.log(user)
      }
    } else {
      console.log('Error! Unable to get a list of Card Products')
      console.log(products)
    }

    console.log('getting Card Transition by token Id...')

    if (cardTransition?.cardTransition?.token) {
      const foundTransition = await client.cardTransition.retrieve(
        cardTransition.cardTransition.token
      )

      if (foundTransition) {
        console.log('Success! Card Transition found.')
      } else {
        console.log('Error! Unable to find Card transition by token Id.')
        console.log(foundTransition)
      }
    } else {
      console.log('Error! Card transition failed.')
    }

    console.log('getting a list of Card Transitions...')

    if (newCard?.card?.token) {
      const list = await client.cardTransition.list(newCard?.card.token)
      if (list?.success) {
        console.log('Success! A list of Card Transitions was retrieved.')
      } else {
        console.log('Error! Unable to get a list of Card Transitions.')
        console.log(list)
      }
    } else {
      console.log('Error! Empty new Card token.')
      console.log(newCard)
    }
  } else {
    console.log('Error! Unable to get a list of Users')
    console.log(users)
  }

})()
