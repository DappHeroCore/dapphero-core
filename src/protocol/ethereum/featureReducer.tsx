import React from 'react'
import { Request, DappHeroConfig } from '../../types/types'
import { EthParent, EthStaticView, EthContractParent } from '../eth'
import { mockConfig } from '../eth/mocks/mockConfig'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'

const getConfig = (): DappHeroConfig => {
  const config = mockConfig
  return config
}

export const featureReducer = (request, element, connected, accounts, injected) => {

  switch (request.feature) {
  case 'network': {
    return (
      <NetworkReducer
        element={element}
      />
    )
  }

  case 'user': {
    return (
      <UserReducer
        element={element}
      />
    )
  }
  // case 'customContract': {
  //   return (
  //     <EthContractParent

  //       request={request}
  //       element={element}
  //       injected={injected}
  //       element={request.element}
  //       signifiers={signifiers}
  //       mock={mock}
  //     />
  //   )
  // }
  case 'threebox': {
    return <ThreeBoxReducer element={element} />
  }
  // case 'nft': {
  //   return <EthParent request={request} config={config} />
  // }
  default:
    return null
  }
}
