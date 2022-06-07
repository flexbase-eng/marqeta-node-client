'use strict'

import { Marqeta } from '../src'
(async () => {

  const client = new Marqeta({
    host: process.env.MARQETA_HOST,
    apiAppToken: process.env.MARQETA_API_APP_TOKEN,
    apiAccessToken: process.env.MARQETA_API_ACCESS_TOKEN
  })

  const mockGroup = {
    name: 'account-holder-group-test-kyb',
  }

  const mockBusiness = {
    businessNameLegal: 'Waynex',
    businessNameDba: 'Waynex',
    dateEstablished: '2020-05-19',
    identifications: [{
      type: 'BUSINESS_TAX_ID',
      value: '123456789'
    }],
    incorporation: {
      addressRegisteredUnder: {
        address1: 'One Microsoft Way',
        city: 'Redmond',
        state: 'WA',
        postalCode: '98052-6399',
        country: 'US',
      },
      stateOfIncorporation: 'NE',
      incorporationType: 'LLC'
    },
    officeLocation: {
      address1: 'One Microsoft Way',
      city: 'Redmond',
      state: 'WA',
      postalCode: '98052-6399',
      country: 'US'
    },
    proprietorOrOfficer: {
      identifications: [{
        type: 'DRIVERS_LICENSE',
        value: '123456789'
      }],
      home: {
        address1: '9339 B Street',
        address2: '',
        city: 'Oakland',
        state: 'CA',
        postalCode: '94603',
        country: 'US'
      },
      ssn: '123456789',
      firstName: 'Bruce',
      middleName: 'foo',
      lastName: 'Wayne',
      dob: '1974-04-17',
    },
    status: 'UNVERIFIED',
    proprietorIsBeneficialOwner: true,
    attestationConsent: true,
    attestationDate: '2022-05-19',
    attesterName: 'Bruce Wayne',
    accountHolderGroupToken: ''
  }
  console.log('getting list of one Marqeta user...')
  let user, userVerified
  const userList = await client.user.list({ count: 1 })

  if (userList?.userList?.isMore && Array.isArray(userList?.userList?.data)) {
    user = userList.userList.data.pop()
    if (user?.token) {
      console.log('sending a User KYC request to Marqeta...')
      userVerified = await client.kyc.verify(
        { userToken: user.token }
      )
      if (userVerified.success) {
        console.log('Success! KYC success for user: ' + user?.token)
      } else {
        console.log('Error! KYC failed for user: ' + user?.token)
        console.log(userVerified)
      }
    } else {
      console.log('Error! Empty user token Id.')
    }
  } else {
    console.log('Error! Unable to get a list of Users to test KYC.')
    console.log(userList)
  }

  console.log('retrieving User KYC result...')
  if (userVerified?.kyc?.token) {
    const retrieved = await client.kyc.retrieve(userVerified.kyc.token)

    if (retrieved?.success && retrieved?.kyc?.token) {
      console.log('Success! Retrieved User KYC result.')
    } else {
      console.log('Error! Unable to retrieve User KYC result.')
      console.log(retrieved)
    }
  } else {
    console.log('Error! Empty User KYC Verification token.')
    console.log(userVerified)
  }

  if (user?.token) {
    console.log('getting list of Marqeta User KYC results...')
    const userResults = await client.kyc.userResults({ ...user })
    if (userResults?.success && Array.isArray(userResults?.kycList?.data)) {
      console.log('Success! A list of KYC results was returned for user: ' +
        user.token
      )
    } else {
      console.log('Error! Unable to get a list of KYC results for user: ' +
        user.token)
      console.log(userResults)
    }
  } else {
    console.log('Error! Empty User token Id. Cannot get a list of User KYC ' +
      'results')
  }


  console.log('getting list of one Marqeta business...')
  const acctHolderGroup = await client.accountHolderGroup.create(mockGroup)
  if (acctHolderGroup?.group?.token) {
    mockBusiness.accountHolderGroupToken = acctHolderGroup.group.token
  } else {
    console.log('Warning! Unable to get an Account Holder Group Tokne.')
  }

  let newB = await client.business.create(mockBusiness)

  if (newB?.business?.token) {
    const state = {
      status: 'UNVERIFIED',
      reasonCode: '02',
      channel: 'API',
      businessToken: newB.business.token,
    }
    const trans = await client.businessTransition.create(state)

    if (!trans.success) {
      console.log('Warning! Unable to transition Business to UNVERIFIED status.')
    }
    const verified = await client.kyc.verify(
      {
        businessToken:newB.business.token,
        manualOverride: true,
      }
    )

    if (verified.success) {
      console.log('Success! KYB success for business: ' + newB?.business.token)
    } else {
      console.log('Error! KYB failed for business: ' + newB?.business.token)
      console.log(verified)
    }
  } else {
    console.log('Error! Empty business token.')
    console.log(newB)
  }

  if (newB?.business?.token) {
    console.log('getting list of Marqeta Business KYC results...')
    const businessResults = await client.kyc.businessResults({ ...newB.business })

    if (businessResults?.success && Array.isArray(businessResults?.kycList?.data)) {
      console.log('Success! A list of KYC results was returned for business: ' +
        newB.business.token
      )
    } else {
      console.log('Error! Unable to get a list of KYC results for business: ' +
        newB.business.token)
      console.log(businessResults)
    }

  } else {
    console.log('Error! Empty Business token Id. Cannot get KYC result')
  }

})()
