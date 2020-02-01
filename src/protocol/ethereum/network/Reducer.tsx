import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import * as hooks from 'hooks'
import { EthEnable } from './EthEnable'
import { EthNetworkInfo } from './EthNetworkInfo'
import { EthTransfer } from './EthTransfer'
import { NetworkFeatureTypes } from './types'

export const Reducer = ({ element, info }) => {
  const injected = hooks.useDappHeroWeb3()
  const { networkName, networkId } = injected
  const defaultInfoObj = {
    networkId: 0,
    networkName: 'Unknown',
  }

  const [ infoValue, setInfoValue ] = useState(defaultInfoObj)

  useEffect(() => {
    const infoValueObj = {
      networkId: networkId ?? 0,
      networkName: networkName ?? 'Unknown',
    }
    setInfoValue(infoValueObj)
  }, [ networkId, networkName ])

  switch (info?.properties[0]?.key) {
  case NetworkFeatureTypes.ENABLE: { // TODO: Drake- we need to settle on if we are going to use this style or not so we can be consistent
    return (
      <EthEnable
        element={element}
      />
    )
  }
  case NetworkFeatureTypes.ID: {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.networkId.toString()}
      />
    )
  }
  case NetworkFeatureTypes.NAME: {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.networkName}
      />
    )
  }
  case NetworkFeatureTypes.TRANSFER: {
    if (element.id.includes('-invoke')) {
      return (
        <EthTransfer element={element} />
      )
    }
    return null
  }
  default:
    return null
  }
}
