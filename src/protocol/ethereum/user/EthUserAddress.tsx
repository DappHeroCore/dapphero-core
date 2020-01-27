import { logger } from 'logger/logger'
import * as hooks from 'hooks'
import { useEffect, FunctionComponent } from 'react'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full'
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {

  const { accounts, networkId } = hooks.useDappHeroWeb3()
  useEffect(() => {
    try {
      if (accounts?.[0]) {
        const [ fullAccountNumber ] = accounts
        element.innerHTML = displayFormat === 'short' ? `${fullAccountNumber.slice(0, 3)}...${fullAccountNumber.slice(fullAccountNumber.length - 3)}` : fullAccountNumber
      }
    } catch (e) {
      console.log(e)
    }
  }, [ accounts, networkId ])

  return null
}
