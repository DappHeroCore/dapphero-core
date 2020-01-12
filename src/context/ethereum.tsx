import React, { createContext } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import PropTypes from 'prop-types'

const modules = [ 'eth', 'erc20' ] // deprecated?

const EthereumContext = createContext({})

function EthereumContextProvider(props) {
  const injected = useWeb3Injected()
  const { connected, accounts } = injected
  const initialContextValue = {
    injected,
    connected,
    accounts,
    modules
  }

  const { children } = props
  console.log('What is children? ', children)
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

// EthereumContextProvider.propTypes = { children: PropTypes.element.isRequired }

// EthereumContextConsumer.propTypes = { children: PropTypes.symbol.isRequired }

export { EthereumContextConsumer, EthereumContextProvider }
