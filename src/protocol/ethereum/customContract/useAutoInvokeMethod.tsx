import { useEffect } from 'react'
import omit from 'lodash.omit'

export const useAutoInvokeMethod = (info, autoInvokeKey, autoClearKey, isTransaction, handleRunMethod, parameters, chainId, POLLING_INTERVAL) => {

  useEffect(() => {
    const ethValue = parameters?.EthValue
    const parsedParameters = omit(parameters, 'EthValue')
    const parametersValues = Object.values(parsedParameters)

    if (autoInvokeKey && chainId === info?.contract?.networkId) {
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }

      const autoClearValue = autoClearKey?.value || false

      if (autoInvokeValue === 'true' && !isTransaction) {
        const intervalId = setInterval(() => handleRunMethod(null, autoClearValue, parametersValues, ethValue), POLLING_INTERVAL)
        return (): void => clearInterval(intervalId)
      }
    }
  }, [ autoInvokeKey, autoClearKey, handleRunMethod, parameters ])
  return null
}
