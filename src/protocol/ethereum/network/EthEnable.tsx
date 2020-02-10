import React, { useEffect, useState, FunctionComponent } from 'react'
import { logger } from 'logger/customLogger'
import * as hooks from 'hooks'
import * as connectors from 'connectors'
import ReactTooltip from 'react-tooltip'
import { useWeb3React } from '@web3-react/core'

interface EthEnableProps {
  element: HTMLElement;
}
/**
 * This function attaches a click handler to any element that a user wants to be responsbile for
 * "enabling metamask".
 * @param props From props we use only injected and request.
 */
export const EthEnable: FunctionComponent<EthEnableProps> = ({ element }) => {
  // const injected = hooks.useDappHeroWeb3()
  const injected = useWeb3React()

  const message = injected.active ? 'Succesfully Connected' : 'Click Connect to MetaMask'
  element.setAttribute('data-tip', message)

  const [ buttonStatus, setButtonStatus ] = useState(element.innerText || 'Enable MetaMask')

  useEffect(() => {
    if (injected.active) {
      setButtonStatus('Connected')
    }
  }, [ injected.active ])

  useEffect(() => {
    try {
      const clickHandler = () => { injected.activate(connectors.injected) }
      element.addEventListener('click', clickHandler, true)

      return (() => element.removeEventListener('click', clickHandler, true))
    } catch (e) {
      logger.log(e)
    }
  }, [ injected.active ])

  element.innerText = buttonStatus

  return (<ReactTooltip />)
}

