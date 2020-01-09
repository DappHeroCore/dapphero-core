import { useContractInstance } from './useContractInstance'
import { useGetMethods } from './useGetMethods'
import { Signifiers } from '../../../types'

export const getBaseContractData = (
  requestString: string[],
  abi: any[],
  contractAddress: string,
  injectedLib: any
) => {
  const method = requestString[3]
  const instance = useContractInstance(abi, contractAddress, injectedLib)
  const methods = useGetMethods(abi, injectedLib)

  return {
    method,
    instance,
    methods,
  }
}
