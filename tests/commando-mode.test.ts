'use strict'

import { Marqeta } from '../src';
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  console.log('getting Marqeta Card Products...')
  const modes = await client.cardProduct.list()

  if (modes?.success) {
    console.log('Success! A list of Commando Modes was retrieved.')
  } else {
    console.log('Error! Unable to get a list of Commando Modes.')
    console.log(modes)
  }

})()
