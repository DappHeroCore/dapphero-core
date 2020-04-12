import React from 'react'

// const ADD_PROVIDER = 'ADD_PROVIDER'
// const ADD_SIGNER = 'ADD_SIGNER'

const actionTypes = {
  addProvider: 'ADD_PROVIDER',
  addSigner: 'ADD_SIGNER',
}

const initialProvider = {
  provider: null,
  signer: null,
  chainId: null,
  enableFunction: null,
}

const providerReducer = ( state, action) => {
  switch (action.type) {
    case actionTypes.addProvider:
      return { ...state, provider: action.provider, chainId: action.chainId }
    case actionTypes.addSigner:
      return { ...state, signer: action.signer, enableFunction: action.enableFunction }
    default:
      return state
  }
}

export const useProvider = () => {
  const [ provider, dispatch ] = React.useReducer(providerReducer, initialProvider)

  const addProvider = async (provider) => {
    dispatch({ type: actionTypes.addProvider, provider, chainId: (await provider.getNetwork()) })
  }
  const addSigner = (signer, enableFunction) => {
    dispatch({ type: actionTypes.addSigner, signer, enableFunction })
  }

  const dhProviderContext = React.createContext(provider)
  return { provider, addProvider, addSigner, dhProviderContext }
}

