import { logger } from 'logger/logger'
import { useEffect, FunctionComponent } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'

interface EthEnableProps {
  element: HTMLElement
}
/**
 * This function attaches a click handler to any element that a user wants to be responsbile for
 * "enabling metamask".
 * @param props From props we use only injected and request.
 */
export const EthEnable: FunctionComponent<EthEnableProps> = ({ element }) => {
  const injected = useWeb3Injected()

  useEffect(() => {
    try {
      element.addEventListener('click', () => { injected.requestAuth() }, false)
    } catch (e) {
      console.log(e)
    }
  }, [ injected.connected ])
  return null
}

