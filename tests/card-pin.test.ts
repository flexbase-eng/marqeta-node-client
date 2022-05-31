import { Marqeta } from '../src';
(async () => {

  const mockCard = {
    cardProductToken: '',
    userToken: '',
  }

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockPin = {
    cardToken: '',
    cardTokenType: '',
    pin: '',
  }

  console.log('getting a list of users...')

  let newCard, user
  const users = await client.user.list()

  if (users?.userList?.count && Array.isArray(users?.userList?.data)) {
    console.log('getting Card Products...')
    const products = await client.cardProduct.list()
    user = users?.userList?.data.pop()

    if (products?.cardProducts?.count
      && Array.isArray(products?.cardProducts?.data)) {
      const product = products?.cardProducts?.data.pop()

      console.log('creating new card PIN...')
      if (user?.token && product?.token) {
        console.log('creating a new Card...')
        mockCard.userToken = user.token
        mockCard.cardProductToken = product.token
        newCard = await client.card.create(mockCard)

        if (newCard.success && newCard?.card?.token) {
          mockPin.cardToken = newCard.card.token
          const pin = await client.cardPin.create(mockPin)

          if (pin.success) {
            console.log('Success! Card PIN created.')
          } else {
            console.log('Error! Unable to create card PIN.')
            console.log(pin)
          }
        } else {
          console.log('Error! Empty new card token Id.')
          console.log(newCard)
        }
      }
      else if (!product?.token) {
        console.log('Error! Empty product token Id.')
        console.log(product)
      }
      else if (!user?.token) {
        console.log('Error! Empty user token Id.')
        console.log(user)
      }
    } else {
      console.log('Error! No Card Products found.')
      console.log(products)
    }
  } else {
    console.log('Error! No users were found.')
    console.log(users)
  }

})()
