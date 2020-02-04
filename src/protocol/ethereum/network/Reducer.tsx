import React, { useState, useEffect, useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import * as hooks from 'hooks'
import { EthEnable } from './EthEnable'
import { EthNetworkInfo } from './EthNetworkInfo'
import { EthTransfer } from './EthTransfer'

export const Reducer = ({ element, info }) => {
  const injected = hooks.useDappHeroWeb3()
  const domElements = hooks.useDomElements()
  const { networkName, networkId } = injected
  const defaultInfoObj = {
    networkId: 0,
    networkName: 'Unknown',
    providerName: 'Unknown',
  }

  const [ infoValue, setInfoValue ] = useState(defaultInfoObj)

  useEffect(() => {

    const isMetamask = (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) ? 'metamask' : null

    const infoValueObj = {
      networkId: networkId ?? 0,
      networkName: networkName ?? 'Unknown',
      providerName: isMetamask ?? 'Unknown',
    }
    setInfoValue(infoValueObj)
  }, [ networkId, networkName ])

  switch (info?.properties[0]?.key) {
  case ('enable'): { // TODO: Drake- we need to settle on if we are going to use this style or not so we can be consistent
    return (
      <EthEnable
        element={element}
      />
    )
  }
  case ('id'): {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.networkId.toString()}
      />
    )
  }
  case ('name'): {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.networkName}
      />
    )
  }
  case ('provider'): {
    return (
      <EthNetworkInfo
        element={element}
        infoValue={infoValue.providerName}
      />
    )
  }
  case ('transfer'): {
    if (info.feature === 'network' && info.properties_?.transfer === 'invoke') {
      const relatedNodes = domElements.filter((item) => item.feature === 'network' && item.properties_.transfer)
      const amountObj = relatedNodes.find(({ properties_: { transfer, inputName } }) => transfer === 'input' && inputName === 'amount')
      const addressObj = relatedNodes.find(({ properties_: { transfer, inputName } }) => transfer === 'input' && inputName === 'address')
      const outputObj = relatedNodes.find(({ properties_: { transfer } }) => transfer === 'output')
      return (
        <EthTransfer element={element} amountObj={amountObj} addressObj={addressObj} outputObj={outputObj} info={info} />
      )
    }
    return null
  }
  default:
    return null
  }
}
