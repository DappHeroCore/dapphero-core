import { ACTION_TYPES } from './stateMachine'

export const callMethod = async ({ readContract, correctedMethodName: methodName, methodParams, dispatch, isPolling }): Promise<void> => {
  // If there is no readContract (yet) then return null
  if (!readContract) return null

  const method = readContract[methodName]
  const methodDetails = { methodName, methodParams, contractAddress: readContract.address, contractNetwork: readContract.provider._network.name }

  dispatch({
    type: ACTION_TYPES.callMethod,
    status: {
      ...methodDetails,
      msg: `Calling public method { ${methodName} }`,
      error: false,
      fetching: true,
      isPolling,
    },
  })

  try {
    const methodResult = await method(...methodParams)

    dispatch({
      type: ACTION_TYPES.callMethod,
      status: {
        ...methodDetails,
        msg: `Calling public method { ${methodName} } success.`,
        error: false,
        fetching: false,
        isPolling,
        methodResult,
      },
    })

    return methodResult
  } catch (error) {
    dispatch({
      type: ACTION_TYPES.callMethodError,
      status: {
        ...methodDetails,
        msg: `Error calling method { ${methodName} } on your contract. Is your Web3 provider on Network: ${readContract.provider._network.name}? Check console for more details.`,
        isPolling,
        fetching: false,
        error,
      },
    } )
  }
}
