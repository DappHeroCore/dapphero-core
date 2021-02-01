
import { useEffect, FunctionComponent, useContext, useMemo } from 'react'
import * as contexts from 'contexts'
import { logger } from 'logger/customLogger'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full';
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {
  const ethereum = useContext(contexts.EthereumContext)
  const { actions: { emitToEvent } } = useContext(EmitterContext)

  const { address, isEnabled } = ethereum

  const memoizedValue = useMemo(
    () => element.innerHTML
    , [],
  )

  useEffect(() => {
    emitToEvent(
      EVENT_NAMES.user.addressStatusChange,
      { value: address, step: 'User address value change', status: EVENT_STATUS.resolved },
    )
  }, [ address, isEnabled ])

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
