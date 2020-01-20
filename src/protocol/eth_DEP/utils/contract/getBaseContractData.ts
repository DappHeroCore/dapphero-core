import { useContractInstance } from './useContractInstance'
import { useGetMethods } from './useGetMethods'

/**
 * This function collects the data required to interact with a particular contract method.
 * This function id
 * @param requestString {array} this is an array of strings which represents the current request from a HTML Element
 * @param abi {object} this is the contract abi object which is required to create a contract instance.
 * @param contractAddress {string} this is the address of a deployed contract
 * @param injectedLib {object} this comes from our web3 provider and provides access to the blockchain and creating contract instances.
 * @returns {string, object, array} returns the method we are currently working with, the instance of the contract, and all the mthods.
 * // TODO: clarify what method is supposed to be and how this is used.
 */
export const getBaseContractData = (
  requestString: string[],
  abi: any[],
  contractAddress: string,
  injectedLib: any,
) => {
  const method = requestString[3] // TODO: We need to be explicit about the index of the request string. Just a number is unclase.
  const instance = useContractInstance(abi, contractAddress, injectedLib)
  const methods = useGetMethods(abi, injectedLib)

  return {
    method,
    instance,
    methods,
  }
}
