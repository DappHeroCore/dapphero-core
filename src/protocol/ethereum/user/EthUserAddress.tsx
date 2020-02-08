
import React, { useEffect, FunctionComponent } from 'react'
import * as hooks from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { logger } from 'logger/customLogger'

interface EthUserAddressProps {
  element: HTMLElement;
  displayFormat: 'short' | 'full'
}

export const EthUserAddress: FunctionComponent<EthUserAddressProps> = ({ element, displayFormat }) => {

  // const { accounts, networkId } = hooks.useDappHeroWeb3()
  const { account } = useWeb3React()
  useEffect(() => {
    try {
      if (account) {
        element.innerHTML = displayFormat === 'short' ? `${account.slice(0, 4)}...${account.slice(account.length - 5)}` : account
      }
    } catch (e) {
      logger.debug('Getting account address failed', e)
    }
  }, [ account ])

  return null
}
