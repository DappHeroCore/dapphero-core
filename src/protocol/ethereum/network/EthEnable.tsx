import React, { useEffect, useState, useContext, FunctionComponent, useMemo } from 'react'
import { logger } from 'logger/customLogger'
import * as contexts from 'contexts'
import ReactTooltip from 'react-tooltip'

interface EthEnableProps {
  element: HTMLElement;
}
/**
 * This function attaches a click handler to any element that a user wants to be responsbile for
 * "enabling metamask".
 * @param props From props we use only injected and request.
 */
export const EthEnable: FunctionComponent<EthEnableProps> = ({ element }) => {
  const memoizedValue = useMemo(
    () => element.innerText
    , [],
  )
  const ethereum = useContext(contexts.EthereumContext)
  const { isEnabled, enable } = ethereum

  const message = isEnabled ? 'Succesfully Connected' : 'Click Connect to MetaMask'
  element.setAttribute('data-tip', message)

  const [ buttonStatus, setButtonStatus ] = useState(element.innerText || 'Enable MetaMask')

  useEffect(() => {
    if (isEnabled) {
      setButtonStatus('Connected')
    } else {
      setButtonStatus(memoizedValue)
    }
  }, [ isEnabled ])

  useEffect(() => {
    try {
      const clickHandler = () => { enable() }
      element.addEventListener('click', clickHandler, true)

      return (() => element.removeEventListener('click', clickHandler, true))
    } catch (e) {
      logger.log(e)
    }
  }, [ isEnabled ])

  element.innerText = buttonStatus

  return (<ReactTooltip />)
}

