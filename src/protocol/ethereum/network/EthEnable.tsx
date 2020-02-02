import React, { useEffect, useState, FunctionComponent } from 'react'
import { logger } from 'logger/customLogger'
import * as hooks from 'hooks'
import * as connectors from 'connectors'
import ReactTooltip from 'react-tooltip'

interface EthEnableProps {
  element: HTMLElement
}
/**
 * This function attaches a click handler to any element that a user wants to be responsbile for
 * "enabling metamask".
 * @param props From props we use only injected and request.
 */
export const EthEnable: FunctionComponent<EthEnableProps> = ({ element }) => {

  const injected = hooks.useDappHeroWeb3()

  const message = injected.connected ? 'Succesfully Connected' : 'Click Connect to MetaMask'
  element.setAttribute('data-tip', message)

  const [ buttonStatus, setButtonStatus ] = useState(element.innerText || 'Enable MetaMask')

  useEffect(() => {
    if (injected.connected) {
      setButtonStatus('Connected')
    }
  }, [ injected.web3ReactContext.active ])

  useEffect(() => {
    try {
      const clickHandler = () => { injected.web3ReactContext.activate(connectors.injected) }
      element.addEventListener('click', clickHandler, true)

      return (() => element.removeEventListener('click', clickHandler, true))
    } catch (e) {
      logger.debug(e)
    }
  }, [ injected.web3ReactContext.active ])

  element.innerText = buttonStatus

  return (<ReactTooltip />)
}

