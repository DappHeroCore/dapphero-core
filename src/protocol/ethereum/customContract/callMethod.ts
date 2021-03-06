import { dsp } from './stateMachine'

export const callMethod = async ({ readContract, correctedMethodName: methodName, methodParams, dispatch, isPolling }): Promise<string> => {
  // If there is no readContract (yet) then return null
  if (!readContract) return null

  const method = readContract.functions[methodName]
  const methodDetails = { methodName, methodParams, contractAddress: readContract.address, contractNetwork: readContract.provider?.network?.name }

  dsp.callFlow.callRequested({ methodDetails, dispatch, isPolling })

  try {
    const methodResult = await method(...methodParams)

    dsp.callFlow.callMethodSucces({ methodDetails, methodResult, isPolling, dispatch })
    return methodResult

  } catch (error) {

    if (isPolling) {
      dsp.callFlow.callMethodAutoInvokeError({ methodDetails, dispatch, isPolling, error })
      return 'error... check the console'
    }
    // Lets check
    dsp.callFlow.callMethodError({ methodDetails, dispatch, isPolling, readContract, error })
    return 'error... check the console'

  }
}
