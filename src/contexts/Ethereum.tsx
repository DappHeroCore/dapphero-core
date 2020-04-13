import React from 'react'

export const EthereumContext = React.createContext({
  provider: null,
  providerType: null,
  chainId: null,
  networkName: null,
  signer: null,
  isEnabled: false,
  enable: null,
  address: null,
})
