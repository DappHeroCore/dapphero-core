import { useEffect } from 'react'

export const useAutoInvokeMethod = ({ info, autoInvokeKey, autoClearKey, isTransaction, handleRunMethod, getParametersFromInputValues, chainId, POLLING_INTERVAL }): void => {
  useEffect(() => {
    if (autoInvokeKey && chainId === info?.contract?.networkId) {
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }
      const autoClearValue = autoClearKey?.value || false

      if (autoInvokeValue === 'true' && !isTransaction) {
        const intervalId = setInterval(() => handleRunMethod(null, autoClearValue), POLLING_INTERVAL)
        return (): void => clearInterval(intervalId)
      }
    }
  }, [ autoInvokeKey, autoClearKey, handleRunMethod, getParametersFromInputValues ])

  return null
}
