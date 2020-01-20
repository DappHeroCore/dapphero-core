import React, { useState, useEffect } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react/useWeb3Hook'
import { EthEnable } from './EthEnable'
import { EthNetworkInfo } from './EthNetworkInfo'

export const Reducer = ({ element }) => {
  const injected = useWeb3Injected()

  const { networkId, providerName, networkName } = injected
  const [ ,, infoType ] = element.id.split('-')

  const defaultInfoObj = {
    networkId: 0,
    providerName: 'Unknown',
    networkName: 'Unknown',
  }

  const [ infoValue, setInfoValue ] = useState(defaultInfoObj)

  useEffect(() => {
    const infoValueObj = {
      networkId: networkId ?? 0,
      providerName: providerName ?? 'Unknown',
      networkName: networkName ?? 'Unknown',
    }

    setInfoValue(infoValueObj)
  }, [ networkId, providerName, networkName ])

  switch (infoType) {
  case 'enable': {
    return (
      <EthEnable
        element={element}
      />
    )
  }
  case 'id': {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.networkId.toString()}
      />
    )
  }
  case 'name': {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.networkName}
      />
    )
  }
  case 'provider': {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.providerName}
      />
    )
  }
  default:
    return null
  }
}
