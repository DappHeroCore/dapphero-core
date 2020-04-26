import { logger } from 'logger/customLogger'
import { ACTION_TYPES } from './stateMachine'

export const callMethod = async ({ readContract, methodName, methodParams, infoToast, dispatch, isPolling }): Promise<void> => {
  const method = readContract.functions[methodName]
  const methodDetails = { methodName, methodParams, contractAddress: readContract.address, contractNetwork: readContract.provider._network.name }

  dispatch({
    type: ACTION_TYPES.callMethod,
    status: {
      msg: `Calling public method { ${methodName} }`,
      error: false,
      ...methodDetails,
      fetching: true,
      isPolling,

    },
  })
  try {
    const methodResult = await method(...methodParams)
    return methodResult
  } catch (error) {
    infoToast({ message: `Error calling method { ${methodName} } on your contract. Is your Web3 provider on Network: ${readContract.provider._network.name}? Check console for more details.` })

    dispatch({
      type: ACTION_TYPES.callMethodError,
      status: {
        msg: `Error calling the view method: { ${methodName} }.`,
        isPolling,
        fetching: false,
        error,
        ...methodDetails,
      },
    } )
  }
}
