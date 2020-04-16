import { logger } from 'logger/customLogger'

export const callMethod = async (contractInstance, methodName, methodParams, setResult, infoToast) => {
  const method = contractInstance.functions[methodName]
  try {
    const methodResult = await method(...methodParams)
    setResult(methodResult)
  } catch (err) {
    logger.info(
      'Invoke contract method failed in view.  This happends when a contract is invoked on the wrong network or when a contract is not deployed on the current network\n',
      err,
    )
    infoToast({ message: 'Invoking a contract function failed in view.  Are you on the right network?' })
  }
}
