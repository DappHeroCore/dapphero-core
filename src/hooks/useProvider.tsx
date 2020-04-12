import React from 'react'

const actionTypes = {
  addProvider: 'ADD_PROVIDER',
  addSigner: 'ADD_SIGNER',
}

const initialProvider = {
  provider: null,
  signer: null,
  chainId: null,
  enableFunction: null,
  address: null,
}

const providerReducer = ( state, action) => {
  switch (action.type) {
    case actionTypes.addProvider:
      return { ...state, provider: action.provider, chainId: action.chainId }
    case actionTypes.addSigner:
      return { ...state, signer: action.signer, enableFunction: action.enableFunction, address: action.address }
    default:
      return state
  }
}

export const useProvider = () => {
  const [ provider, dispatch ] = React.useReducer(providerReducer, initialProvider)

  const addProvider = async (provider) => {
    dispatch({ type: actionTypes.addProvider, provider, chainId: (await provider.getNetwork()) })
  }
  const addSigner = (signer, address, enableFunction) => {
    dispatch({ type: actionTypes.addSigner, signer, enableFunction, address })
  }

  const dhProviderContext = React.createContext(provider)
  return { provider, addProvider, addSigner, dhProviderContext }
}

