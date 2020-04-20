
import { useEffect, FunctionComponent, useContext, useMemo } from 'react'
import * as contexts from 'contexts'
import { logger } from 'logger/customLogger'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full';
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {
  const ethereum = useContext(contexts.EthereumContext)
  const { address, isEnabled } = ethereum

  const memoizedValue = useMemo(
    () => element.innerHTML
    , [],
  )

  useEffect(() => {
    try {
      if (address && isEnabled) {
        element.innerHTML = displayFormat === 'short' ? `${address.slice(0, 4)}...${address.slice(address.length - 5)}` : address
      } else {
        element.innerHTML = memoizedValue
      }
    } catch (e) {
      logger.log('Getting account address failed', e)
    }
  }, [ address ])

  return null
}
