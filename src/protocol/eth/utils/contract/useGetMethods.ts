import { useEffect, useState } from 'react'
import Web3 from 'web3'

/**
 * This function, (a react custom hook) takes in the abi of a contract, parses it for all
 * the methods, gets the signature of each method (so that we can identify and call overloaded functions)
 * and creates an object where we have the method, it's signature, and an array of arguments with their name
 * and type easilly accesible.
 * @param abi {object} the interface for a contract nessesary to create a contract instance
 * @param web3 {object} the web3 library for interacting with ethereum
 * @returns {array} and array of functions with the important data neatly appended.
 */
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
