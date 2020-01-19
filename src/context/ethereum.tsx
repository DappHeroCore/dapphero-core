import React, { createContext, useEffect, useState } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import * as consts from 'consts'

const modules = [ 'eth', 'erc20' ] // deprecated?

export const EthereumContext = createContext({})

export function EthereumContextProvider(props) {
  const { children } = props

  const injected = useWeb3Injected()
  const { connected, accounts, networkId, networkName, providerName } = injected
  const initialContextValue = {
    injected,
    connected,
    accounts,
    networkId,
    networkName,
    providerName,
    modules,
  }

  const [ , setIt ] = useState(false)
  useEffect(() => {
    setIt((it) => !it)
  }, [ accounts, networkId, networkName])

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
