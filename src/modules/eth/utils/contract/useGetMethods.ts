import { useEffect, useState } from 'react'
import Web3 from 'web3'

export const useGetMethods = (abi: any[], web3: Web3) => {
  const [ functions, setFunctions ] = useState(null)

  useEffect(() => {
    const newFunctions = abi.map((method) => ({
      ...method,
      signature: web3.eth.abi.encodeFunctionSignature(method),
      arguments: method.inputs.map((input) => ({
        name: input.name,
        type: input.type
      }))
    }))
    setFunctions(newFunctions)
  }, [])

  return functions
}
