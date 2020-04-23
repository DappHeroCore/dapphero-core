import { useEffect } from 'react'

export const useAutoInvokeMethod = ({
  info,
  autoInvokeKey,
  autoClearKey,
  readEnabled,
  readContract,
  isTransaction,
  handleRunMethod,
  readChainId,
  POLLING_INTERVAL,
}): void => {

  useEffect(() => {
    // console.log('info?.contract?.networkId', info?.contract?.networkId)
    // console.log('readChainId', readChainId)
    // console.log('autoInvokeKey', autoInvokeKey)
    if (autoInvokeKey && readChainId === info?.contract?.networkId) {
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }
      const autoClearValue = autoClearKey?.value || false

      if (autoInvokeValue === 'true' && !isTransaction) {
        const intervalId = setInterval(() => handleRunMethod(null, autoClearValue), POLLING_INTERVAL)
        return (): void => clearInterval(intervalId)
      }
    }
  }, [ readEnabled, readContract ])

  return null
}
