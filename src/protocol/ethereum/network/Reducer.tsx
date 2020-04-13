import React, { useState, useEffect, useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import * as hooks from 'hooks'
import * as contexts from 'contexts'
import { logger } from 'logger/customLogger'
import { EthEnable } from './EthEnable'
import { EthNetworkInfo } from './EthNetworkInfo'
import { EthTransfer } from './EthTransfer'


export const Reducer = ({ element, info }) => {
  const domElements = hooks.useDomElements()
  const defaultInfoObj = {
    chainId: 0,
    name: 'Unknown',
    providerName: 'Unknown',
  }

  const [ infoValue, setInfoValue ] = useState(defaultInfoObj)

  const ethereum = useContext(contexts.EthereumContext)
  const { writeProvider } = ethereum

  // Who is the provider?
  useEffect(() => {
    const providerName = (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) ? 'metamask' : null
    setInfoValue({ ...infoValue, providerName })
  }, [ writeProvider ])

  useEffect(() => {

    const getWriteProviderInfo = async () => {
      try {
        const networkInfo = await writeProvider.ready
        const { name, chainId } = networkInfo
        setInfoValue({ ...infoValue, name: (name === 'homestead') ? 'mainnet' : name, chainId }) // no one uses homstead as a name
      } catch (error) {
        logger.log('Error getting write provider data in Network Reducer', error)
      }
    }

    if (writeProvider) getWriteProviderInfo()
  }, [ writeProvider ])

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
          infoValue={infoValue.chainId.toString()}
        />
      )
    }
    case ('name'): {
      return (
        <EthNetworkInfo
          element={element}
          infoValue={infoValue.name}
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
