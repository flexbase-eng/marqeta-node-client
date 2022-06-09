import { Marqeta } from '../src'
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
    cardtokenType: '',
    controlToken: '',
    controltokenType: '',
    cardholderVerificationMethod: '',
    pin: '',
  }

  let newCard, user, controlToken, product, products, upsertPin

  console.log('getting Marqeta user...')
  const users = await client.user.list()

  if (users?.userList?.count && Array.isArray(users?.userList?.data)) {
    products = await client.cardProduct.list()
    user = users?.userList?.data.pop()
  } else {
    console.log('Error! No users were found.')
    console.log(users)
  }

  console.log('getting Card Products...')

  if (products?.cardProducts?.count
    && Array.isArray(products?.cardProducts?.data)) {
    product = products?.cardProducts?.data.pop()
  } else {
    console.log('Error! No Card Products found.')
    console.log(products)
  }

  console.log('creating a new Card...')

  if (user?.token && product?.token) {
    mockCard.userToken = user.token
    mockCard.cardProductToken = product.token
    newCard = await client.card.create(mockCard)

    if (!newCard?.card?.token) {
      console.log('Error! Unable to create new Card.')
      console.log(newCard)
    }
  } else if (!product?.token) {
    console.log('Error! Empty product token Id.')
    console.log(product)
  } else if (!user?.token) {
    console.log('Error! Empty user token Id.')
    console.log(user)
  }

  console.log('creating a new Card PIN Control Token...')

  if (newCard?.card?.token) {
    mockPin.cardToken = newCard.card.token
    mockPin.controltokenType = 'SET_PIN'
    console.log(`${JSON.stringify(mockPin)}\n`)
    controlToken = await client.cardPin.createControlToken(mockPin)
    console.log(`${JSON.stringify(controlToken)}\n`)

    if (controlToken.success) {
      console.log('Success! Card PIN Control Token created.')
    } else {
      console.log('Error! Unable to create card PIN Control Token.')
      console.log(controlToken)
    }
  } else {
    console.log('Error! Empty Card token Id.')
    console.log(newCard)
  }

  console.log('creating and setting card PIN...')

  if (controlToken?.cardPin?.controlToken) {
    mockPin.pin = '1234'
    mockPin.controlToken = controlToken.cardPin.controlToken
    console.log(`${JSON.stringify(mockPin)}\n`)
    upsertPin = await client.cardPin.upsert(mockPin)
    console.log(`${JSON.stringify(upsertPin)}\n`)

    if (upsertPin?.success) {
      console.log('Success! Card PIN was set successfully.')
    } else {
      console.log('Error! Unable to set Card PIN.')
      console.log(upsertPin)
    }
  } else {
    console.log('Error! Empty Control token Id.')
    console.log(controlToken)
  }

  console.log('revealing card PIN...')

  if (controlToken?.cardPin?.controlToken) {
    mockPin.controlToken = controlToken.cardPin.controlToken
    mockPin.cardholderVerificationMethod = 'LOGIN'
    console.log(mockPin)
    console.log(`${JSON.stringify(mockPin)}\n`)
    const revealPin = await client.cardPin.revealPin(mockPin)
    console.log(`${JSON.stringify(revealPin)}\n`)

    if (revealPin?.success) {
      console.log('Success! Card PIN was successfully revealed.')
    } else {
      console.log('Error! Unable to reveal Card PIN.')
      console.log(revealPin)
    }
  } else {
    console.log('Error! Empty Card PIN.')
    console.log(newCard)
  }

})()
