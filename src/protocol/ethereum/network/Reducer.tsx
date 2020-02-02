import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import * as hooks from 'hooks'
import { EthEnable } from './EthEnable'
import { EthNetworkInfo } from './EthNetworkInfo'
import { EthTransfer } from './EthTransfer'

export const Reducer = ({ element, info }) => {
  const injected = hooks.useDappHeroWeb3()

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
    if (info.properties.find((property) => property.key === 'transfer').value === 'invoke') {
      const relatedNodes = Array.from(document.querySelectorAll('[data-dh-feature=network]'))
      const amountNode = relatedNodes.filter((networkNode) => networkNode.getAttribute('data-dh-property-transfer') === 'input').find((inputNode) => inputNode.getAttribute('data-dh-property-inputName') === 'amount')
      const addressNode = relatedNodes.filter((networkNode) => networkNode.getAttribute('data-dh-property-transfer') === 'input').find((inputNode) => inputNode.getAttribute('data-dh-property-inputName') === 'address')
      const outputNode = relatedNodes.find((networkNode) => networkNode.getAttribute('data-dh-property-transfer') === 'output')
      return (
        <EthTransfer element={element} amountNode={amountNode} addressNode={addressNode} outputNode={outputNode} info={info} />
      )
    }
    return null
  }
  default:
    return null
  }
}
