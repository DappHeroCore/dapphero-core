import React from 'react'
import * as api from 'api'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { Reducer as StaticReducer } from './static/Reducer'
import { useGetMethods } from './useGetMethods'
import { useContractInstance } from './useContractInstance'
import { parseIdTag } from './utils/parseIdTag'

export const Reducer = ({ element }) => {
  const context = useWeb3Injected()
  const { lib } = context

  const type = element.id.split('-')[2]

  switch (type) {
  case 'static': {
    const { contractName, methodName, returnValueName, argMatches, args, decimals, display } = parseIdTag(element.id)
    const { contractAddress, abi } = api.dappHero.getContractByName(contractName)
    const contractInstance = useContractInstance(abi, contractAddress, lib)
    const methods = useGetMethods(abi, lib)

    const { signature } = methods.filter((m) => m.name === methodName)[0] // TODO: be explicit about this Zero.

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
  // case 'dynamic': {
  //   return <EthUserBalance element={element} units={units} decimals={decimals} />
  // }
  default:
    return null
  }
}
