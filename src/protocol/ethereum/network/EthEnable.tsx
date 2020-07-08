import React, { useEffect, useState, useContext, FunctionComponent, useMemo } from 'react'
import { useToasts } from 'react-toast-notifications'
import { logger } from 'logger/customLogger'
import * as contexts from 'contexts'
import * as consts from 'consts'
import ReactTooltip from 'react-tooltip'

interface EthEnableProps {
  element: any;
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

  const memoizedInputValueForWebflow = useMemo(() => element.value, [])

  const ethereum = useContext(contexts.EthereumContext)
  const { addToast } = useToasts()

  const { isEnabled, enable } = ethereum

  const noWeb3Provider = () => { addToast('No Web3 provider found.', { appearance: 'info', autoDismiss: true, autoDismissTimeout: consts.global.REACT_TOAST_AUTODISMISS_INTERVAL }) }

  const message = isEnabled ? 'Succesfully Connected' : 'Click Connect to MetaMask'
  element.setAttribute('data-tip', message)

  const [ buttonStatus, setButtonStatus ] = useState(element.innerText || 'Enable MetaMask')

  useEffect(() => {
    if (isEnabled) {
      setButtonStatus('Connected')
      element.value = 'Connected'
    } else {
      setButtonStatus(memoizedValue)
      element.value = memoizedValue || memoizedInputValueForWebflow
    }
  }, [ isEnabled ])

  useEffect(() => {
    try {
      element.addEventListener('click', enable || noWeb3Provider, true)

      return (() => element.removeEventListener('click', enable || noWeb3Provider, true))
    } catch (e) {
      logger.log(e)
    }
  }, [ isEnabled, enable ])

  element.innerText = buttonStatus

  return (<ReactTooltip />)
}

