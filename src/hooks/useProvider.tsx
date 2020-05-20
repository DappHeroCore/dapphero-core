import React from 'react'

const actionTypes = {
  addProvider: 'ADD_PROVIDER',
  addSigner: 'ADD_SIGNER',
  addWriteProvider: 'ADD_WRITE_PROVIDER',
}

const initialProvider = {
  provider: null,
  writeProvider: null,
  signer: null,
  readChainId: null,
  enableFunction: null,
  address: null,
}

const providerReducer = ( state, action) => {
  switch (action.type) {
    case actionTypes.addProvider:
      return { ...state, provider: action.provider, chainId: action.chainId }
    case actionTypes.addSigner:
      return { ...state, signer: action.signer, enableFunction: action.enableFunction, address: action.address }
    case actionTypes.addWriteProvider:
      return { ...state, writeProvider: action.provider }
    default:
      return state
  }
}

export const useProvider = () => {
  const [ provider, dispatch ] = React.useReducer(providerReducer, initialProvider)

  const addProvider = async (provider) => {
    const chainId = await provider.getNetwork()
    dispatch({ type: actionTypes.addProvider, provider, chainId })
  }
  const addSigner = (signer, address, enableFunction) => {
    dispatch({ type: actionTypes.addSigner, signer, enableFunction, address })
  }

  const addWriteProvider = async (provider) => {
    dispatch({ type: actionTypes.addWriteProvider, provider })
  }

  const dhProviderContext = React.createContext(provider)
  return { provider, addProvider, addSigner, addWriteProvider, dhProviderContext }
}

