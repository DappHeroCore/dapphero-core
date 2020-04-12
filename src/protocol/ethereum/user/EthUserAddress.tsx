
import React, { useEffect, FunctionComponent, useContext, useState } from 'react'
import * as contexts from 'contexts'
import { logger } from 'logger/customLogger'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full';
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {

  const [ address, setAddress ] = useState(null)
  const ethereum = useContext(contexts.EthereumContext)
  const { signer } = ethereum

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
