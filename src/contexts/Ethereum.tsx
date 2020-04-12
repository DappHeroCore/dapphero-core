import React from 'react'

export const EthereumContext = React.createContext({
  provider: null,
  writeProvider: null,
  signer: null,
  chainId: null,
  enableFunction: null,
  address: null,
})
