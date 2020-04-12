
import React, { useEffect, FunctionComponent, useContext, useState } from 'react'
import * as contexts from 'contexts'
import { useWeb3React } from '@web3-react/core'
import { logger } from 'logger/customLogger'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full';
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {

  const [ address, setAddress ] = useState('')
  const ethereum = useContext(contexts.EthereumContext)
  const { signer } = ethereum

  useEffect(() => {
    const getAddress = async () => {
      try {
        setAddress(await (signer.getAddress()))
      } catch (error) {
        logger.log(`Error in retriving the users address`, error)
      }
    }
    if (signer) getAddress()
  }, [ signer ])

  useEffect(() => {
    try {
      if (address) {
        element.innerHTML = displayFormat === 'short' ? `${address.slice(0, 4)}...${address.slice(address.length - 5)}` : address
      }
    } catch (e) {
      logger.log('Getting account address failed', e)
    }
  }, [ address ])

  return null
}
