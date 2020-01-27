import { useEffect, FunctionComponent } from 'react'
import * as hooks from 'hooks'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'

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

  useEffect(() => {
    try {
      const clickHandler = () => { injected.activate() }
      element.addEventListener('click', clickHandler, true)
      return (() => element.removeEventListener('click', clickHandler, true))
    } catch (e) {
      console.log(e)
    }
  }, [ injected.active ])
  return null
}

