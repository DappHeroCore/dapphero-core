import React from 'react'
import { Request, DappHeroConfig } from '../../types/types'
import { EthParent, EthStaticView, EthContractParent } from '../eth'
import { mockConfig } from '../eth/mocks/mockConfig'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'

const getConfig = (): DappHeroConfig => {
  const config = mockConfig
  return config
}

const reactKeyIndex = 0

export const featureReducer = (request: Request, element, connected, accounts, injected) => {
  const action = request.requestString[request.index + 1]

  switch (request.feature) {
  case 'network': {
    return (
      <NetworkReducer
        request={request}
        element={element}
        injected={injected}
        accounts={accounts}
        action={action}
      />
    )
  }

  case 'user': {
    return (
      <UserReducer
        requestString={request.requestString}
        element={element}
        injected={injected}
        accounts={accounts}
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
    return <EthParent key={reactKeyIndex} request={request} config={config} />
  }
  case 'nft': {
    return <EthParent key={reactKeyIndex} request={request} config={config} />
  }
  default:
    return null
  }
}
