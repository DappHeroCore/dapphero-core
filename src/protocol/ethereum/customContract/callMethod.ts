import { logger } from 'logger/customLogger'

export const callMethod = async ({ readContract, methodName, methodParams, infoToast, setStatus }): Promise<void> => {
  const method = readContract.functions[methodName]

  try {
    const methodResult = await method(...methodParams)
    return methodResult
  } catch (err) {
    infoToast({
      message: `Invoking a contract function failed in view.  Are you on the right network? DappHero tried to call 
    method: ${methodName} while on Network: ${readContract.provider._network.name}`,
    })
    setStatus({
      error: true,
      type: 'view method call',
      info: { err, methodName, methodParams, contractAddress: readContract.address, contractNetwork: readContract.provider._network.name },
    } )
  }
}
