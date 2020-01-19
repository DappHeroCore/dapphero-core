import React from 'react'
import { Request, DappHeroConfig } from '../types'
import { EthParent, EthStaticView, EthContractParent } from '../eth'
import { mockConfig } from '../eth/mocks/mockConfig'
import { Reducer as NetworkReducer } from './network/Reducer'

const getConfig = (): DappHeroConfig => {
  const config = mockConfig
  return config
}

const reactKeyIndex = 0

export const featureReducer = (request: Request, element, connected, accounts, injected) => {
  switch (request.arg) {
  // case 'eth': {
  //   const config = getConfig()
  //   reactKeyIndex += 1
  //   return (
  //     <EthParent key={reactKeyIndex} request={request} config={config} />

  //   )
  // }
  case 'network': {
    return (
      <NetworkReducer
        request={request}
        element={element}
        injected={injected}
        accounts={accounts}
      />
    )
  }

  case 'user': {
    return (
      <EthStaticView
        request={request}
        element={element}
        injected={injected}
        accounts={accounts}
        signifiers={signifiers}
      />
    )
  }
  case 'customContract': {
    return (
      <EthContractParent
        request={request}
        element={element}
        injected={injected}
        element={request.element}
        signifiers={signifiers}
        mock={mock}
      />
    )
  }
  case 'threebox': {
    return (
      <EthParent key={reactKeyIndex} request={request} config={config} />
    )
  }
  case 'nft': {
    return (
      <EthParent key={reactKeyIndex} request={request} config={config} />
    )
  }
  default:
    return null
  }
}
