import React, { createContext, useState } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import PropTypes from 'prop-types'
import { EventEmitter } from 'events'

const modules = [ 'eth', 'erc20' ] // deprecated?

const EthereumContext = createContext({})
const emitter = new EventEmitter()

function EthereumContextProvider(props) {
  const injected = useWeb3Injected()
  const { connected, accounts } = injected
  const initialContextValue = {
    injected,
    connected,
    accounts,
    modules
  }

  const { children, forceUpdate } = props

  injected.on('NetworkIdChanged', forceUpdate)
  emitter.setMaxListeners(2)

  return (
    <EthereumContext.Provider value={initialContextValue}>
      {children}
    </EthereumContext.Provider>
  )
}

function EthereumContextConsumer(props) {
  const { children } = props
  return <EthereumContext.Consumer>{children}</EthereumContext.Consumer>
}

export { EthereumContextConsumer, EthereumContextProvider }
