import React from 'react'
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
  const formatOptions = requestString.slice(requestStringIndex + 1)

  //const format = formatOptions.split("_")
  console.log("Fromat Options: ", formatOptions)

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
