import React from 'react'
import { elementType } from 'prop-types'
import { format } from 'path'
import { Request, DappHeroConfig } from '../../types'
import { mockConfig } from '../../eth/mocks/mockConfig'
import { EthUserInfo } from './EthUserInfo'
import { EthUserAddress } from './EthUserAddress'

const getConfig = (): DappHeroConfig => {
  const config = mockConfig
  return config
}

export const Reducer = (request: Request, connected, element, accounts, injected) => {

  const { requestString, requestStringIndex } = request
  const action = requestString[requestStringIndex]

  // This returns an array of all the arguments after the "action"
  const formatOptions = requestString.slice(requestStringIndex + 1)


  // TODO: TWO QUESTIONS: 1) how to do the below filtering better,
  // 2) Why does the request work in the way it does?
  const decimals = formatOptions.map((el) => {
    const splitElement = el.split('_')
    if (splitElement[0] === 'decimals') {
      return splitElement[1]
    }
  })

  const units = formatOptions.map((el) => {
    const splitElement = el.split('_')
    if (splitElement[0] === 'units') {
      return splitElement
    }
  })

  switch (action) {
  case 'address': {
    return (
      <EthUserAddress
        request={request}
        injected={request.injected}
        element={request.element}
        infoType={action}
        accounts={request.accounts}
      />
    )
  }
  case 'balance': {
    return (
      <EthUserInfo
        request={request}
        injected={request.injected}
        element={request.element}
        infoType={action}
        accounts={request.accounts}
      />
    )
  }
  default:
    return null
  }
}
