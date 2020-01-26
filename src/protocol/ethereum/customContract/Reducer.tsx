import React, { useEffect, useState } from 'react'
import * as api from 'api'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { Reducer as StaticReducer } from './static/Reducer'
import { Reducer as DynamicReducer } from './dynamic/Reducer'
import { Reducer as ViewReducer } from './view/Reducer'
import { useGetMethods, parseIdTag } from './utils'
import { CustomContractTypes } from './types'

export const Reducer = ({ element, configuration }) => {
  const injectedContext = useWeb3Injected()
  const [ context, setcontext ] = useState(injectedContext)

  useEffect(() => {
    setcontext(injectedContext)

  }, [ injectedContext.networkId ])

  const { lib, networkId } = context
  const type = element.id.split('-')[2]

  const { contractName, methodName, returnValueName, argMatches, args, decimals, display } = parseIdTag(element.id)
  const contractData = configuration.contracts.reduce((acc, contract) => {
    if (
      contract.contractName === contractName
      && networkId === contract.networkId
    ) {
      return contract
    }
    return acc
  }, null)

  // TODO: [DEV-117] convert networkId matches to return networkName matches
  if (contractData == null) {
    const networkIdsWithContractNameMatches = configuration.contracts
      .filter((contract) => contract.contractName === contractName)
      .map((contract) => contract.networkId)

    if (networkIdsWithContractNameMatches.length > 0) {
      console.warn(`Contract with Name: ${contractName} does not exist on the currently connected network.  It does exist on these network Ids: ${networkIdsWithContractNameMatches.join(', ')} `)
    }
  }

  if (contractData == null) return null

  const { contractAbi, contractAddress } = contractData
  const contractInstance = new lib.eth.Contract(contractAbi, contractAddress)
  const methods = useGetMethods(contractAbi, lib)
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
          abi={contractAbi}
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
          abi={contractAbi}
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
