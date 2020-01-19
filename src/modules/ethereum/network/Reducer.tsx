import React from 'react'
import { Request, DappHeroConfig } from '../types'
import { EthParent, EthStaticView, EthContractParent, EthEnable } from '../../eth'
import { mockConfig } from '../eth/mocks/mockConfig'
import { EthNetworkInfo } from './EthNetworkInfo'

const getConfig = (): DappHeroConfig => {
  const config = mockConfig
  return config
}

export const Reducer = (actionName, request: Request, connected, accounts, injected) => {
  switch (actionName) {
  // case 'eth': {
  //   const config = getConfig()
  //   reactKeyIndex += 1
  //   return (
  //     <EthParent key={reactKeyIndex} request={request} config={config} />

  //   )
  // }
  case 'enable': {
    return (
      <EthEnable
        request={request}
        injected={injected}
        accounts={accounts}
      />
    )
  }
  case 'id':
  case 'name':
  case 'provider': {
    return (
      <EthNetworkInfo
        request={request}
        injected={injected}
        accounts={accounts}
      />
    )
  }
  default:
    return null
  }
}
