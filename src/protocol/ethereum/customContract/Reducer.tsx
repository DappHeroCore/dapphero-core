import React from 'react'
import * as api from 'api'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { StaticMethod } from './StaticMethod'
import { DynamicMethod } from './DynamicMethod'
import { ViewMethod } from './ViewMethod'
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
      <StaticMethod
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
        <ViewMethod
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
        <DynamicMethod
          element={element}
          abi={abi}
          contractInstance={contractInstance}
          signature={signature}
          lib={lib}
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
