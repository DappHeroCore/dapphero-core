import React, { createContext } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import * as consts from 'consts'

const modules = [ 'eth', 'erc20' ] // deprecated?

export const EthereumContext = createContext({})

export function EthereumContextProvider(props) {
  const injected = useWeb3Injected()
  const { connected, accounts } = injected
  const initialContextValue = {
    injected,
    connected,
    accounts,
    modules,
  }
  // TODO: add polling here consts.global.POLLING_INTERVAL
  const { children } = props

  return (
    <EthereumContext.Provider value={initialContextValue}>
      {children}
    </EthereumContext.Provider>
  )
}

export function EthereumContextConsumer(props) {
  const { children } = props
  return <EthereumContext.Consumer>{children}</EthereumContext.Consumer>
}
