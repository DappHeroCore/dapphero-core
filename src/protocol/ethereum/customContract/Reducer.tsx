import React from 'react'
import * as api from 'api'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { Reducer as StaticReducer } from './static/Reducer'
import { Reducer as DynamicReducer } from './dynamic/Reducer'
import { Reducer as ViewReducer } from './view/Reducer'
import { useGetMethods, useContractInstance, parseIdTag } from './utils'
import { CustomContractTypes } from './types'

export const Reducer = ({ element }) => {
  const context = useWeb3Injected()
  const { lib } = context

  const type = element.id.split('-')[2]

  const { contractName, methodName, returnValueName, argMatches, args, decimals, display } = parseIdTag(element.id)
  const { contractAddress, abi } = api.dappHero.getContractByName(contractName)

  const contractInstance = useContractInstance(abi, contractAddress, lib)
  const methods = useGetMethods(abi, lib)
  const { signature } = methods.filter((m) => m.name === methodName)[0] // TODO: be explicit about this Zero.

  switch (type) {
  case CustomContractTypes.STATIC: {
    return (
      <StaticReducer
        element={element}
        returnValueName={returnValueName}
        args={args}
        decimals={decimals}
        display={display}
        contractInstance={contractInstance}
        abi={abi}
        signature={signature}
        web3={lib}
      />
    )
  }

  case CustomContractTypes.VIEW: {
    if (element.id.includes('-invoke')) {
      return (
        <ViewReducer
          element={element}
          abi={abi}
          signature={signature}
          contractInstance={contractInstance}
          contractName={contractName}
          web3={lib}
          methodName={methodName}
        />
      )
    }
    return null
  }

  case CustomContractTypes.DYNAMIC: {
    if (element.id.includes('-invoke')) {
      // only running 'invoke' element through reducer
      // on submit tx, other elements are gathered
      return (
        <DynamicReducer
          element={element}
          abi={abi}
          contractInstance={contractInstance}
          signature={signature}
          web3={lib}
          methodName={methodName}
        />
      )
    }
    return null
  }
  default:
    return null
  }
}
