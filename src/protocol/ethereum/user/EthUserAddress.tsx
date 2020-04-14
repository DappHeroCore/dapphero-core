
import { useEffect, FunctionComponent, useContext } from 'react'
import * as contexts from 'contexts'
import { logger } from 'logger/customLogger'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full';
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {
  const ethereum = useContext(contexts.EthereumContext)
  const { address } = ethereum

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
