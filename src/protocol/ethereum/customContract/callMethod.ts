import { dsp } from './stateMachine'

export const callMethod = async ({ readContract, correctedMethodName: methodName, methodParams, dispatch, isPolling }): Promise<string> => {
  // If there is no readContract (yet) then return null
  if (!readContract) return null

  const method = readContract[methodName]
  const methodDetails = { methodName, methodParams, contractAddress: readContract.address, contractNetwork: readContract.provider?.network?.name }

  dsp.callFlow.callRequested({ methodDetails, dispatch, isPolling })

  // Test if a call will succed before throwing a major error:

  // try {
  //   const result = await readContract.callStatic[methodName](...methodParams)
  //   console.log('The result: ', result)
  // } catch (error) {
  //   console.log('The call static error: ', error)
  // }

  try {
    const methodResult = await method(...methodParams)

    dsp.callFlow.callMethodSucces({ methodDetails, methodResult, isPolling, dispatch })
    return methodResult

  } catch (error) {
    console.log('Error Details')
    console.log(JSON.stringify(error, null, 2))
    // This error reason is no longer relevant, the provider will reload the page. Keeping it for reference.
    // if (error.reason === 'underlying network changed') {}
    if (isPolling) {
      dsp.callFlow.callMethodAutoInvokeError({ methodDetails, dispatch, isPolling, error })
      return 'error... check the console'
    }
    // Lets check
    dsp.callFlow.callMethodError({ methodDetails, dispatch, isPolling, readContract, error })
    return 'error... check the console'

  }
}
