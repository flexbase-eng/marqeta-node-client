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

  const mockCardTransition = {
    token: '',
    state: 'ACTIVE',
    reason: 'I want to use this card, so activate it.',
    reasonCode: '00',
    channel: 'API',
    cardToken: '',
  }

  console.log('getting a list of users...')
  const users = await client.user.list()

  if (users?.userList?.count && Array.isArray(users?.userList?.data)) {

    console.log('getting the User Card Products...')
    const products = await client.cardProduct.list()
    const user = users?.userList?.data.pop()
    console.log(user)
    let newCard

    if (products?.cardProducts?.count
      && Array.isArray(products?.cardProducts?.data)) {
      const product = products?.cardProducts?.data.pop()

      if (user?.token && product?.token) {
        const state = {
          status: 'ACTIVE',
          reasonCode: '02',
          channel: 'API',
          userToken: user.token,
        }
        const userTransition = await client.user.transition(state)
        console.log('transition')
        console.log(userTransition)
        if (userTransition?.success) {
          mockCard.userToken = user.token
          mockCard.cardProductToken = product.token
          newCard = await client.card.create(mockCard)

          if (newCard.success && newCard?.card?.token) {
            mockCardTransition.cardToken = newCard.card.token
            const transitioned = await client.cardTransition.create(
              mockCardTransition
            )

            if (transitioned?.success) {
              console.log('Success! Card transitioned to "ACTIVE" state.')
              console.log(transitioned)
            } else {
              console.log('Error! Unable to transition card.')
              console.log(transitioned)
            }
          } else {
            console.log('Error! Unable to create a new Card.')
            console.log(newCard)
          }

        } else {
          console.log('Error! Unable to transition user to "ACTIVE" status.')
          console.log(userTransition)
        }
      } else {
        console.log('Error! Empty user token.')
        console.log(user)
      }
    } else {
      console.log('Error! Unable to get a list of Card Products')
      console.log(products)
    }

  } else {
    console.log('Error! Unable to get a list of Users')
    console.log(users)
  }

})()
