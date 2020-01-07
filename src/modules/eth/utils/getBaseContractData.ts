import { useContractInstance } from './useContractInstance'
import { useGetMethods } from './useGetMethods'
import { Signifiers } from '../../types'

export const getBaseContractData = (
  requestString: string[],
  abi: any[],
  contractAddress: string,
  injectedLib: any
) => {
  const method = requestString[3]
  const instance = useContractInstance(abi, contractAddress, injectedLib)
  const methods = useGetMethods(abi, injectedLib)

  const identifyReturnValue = requestString.filter((rs) => rs.startsWith(Signifiers.IDENTIFY_RETURN_VALUE)); // eslint-disable-line
  let identifiedReturnValue
  if (identifyReturnValue.length) {
    identifiedReturnValue = identifyReturnValue[0].split(Signifiers.IDENTIFY_RETURN_VALUE)[1]
  }

  const eventTrigger = requestString.filter((rs) => rs.startsWith(Signifiers.EVENT_TRIGGER))

  return {
    method,
    instance,
    methods,
    identifiedReturnValue,
    eventTrigger
  }
}
