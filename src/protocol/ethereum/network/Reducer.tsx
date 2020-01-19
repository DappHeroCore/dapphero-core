import React from 'react'
import { Request, DappHeroConfig } from '../../../types/types'
import { EthEnable } from '../../eth'
import { mockConfig } from '../../eth/mocks/mockConfig'
import { EthNetworkInfo } from './EthNetworkInfo'

const getConfig = (): DappHeroConfig => {
  const config = mockConfig
  return config
}

export const Reducer = (request: Request, connected, element, accounts, injected) => {

  switch (request.action) {
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
        injected={request.injected}
        element={request.element}
        infoType={request.action}
      />
    )
  }
  default:
    return null
  }
}
