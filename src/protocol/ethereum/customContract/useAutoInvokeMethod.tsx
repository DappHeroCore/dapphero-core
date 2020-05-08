import { useEffect } from 'react'

import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'

export const useAutoInvokeMethod = ({
  info,
  autoInvokeKey,
  readEnabled,
  readContract,
  isTransaction,
  handleRunMethod,
  readChainId,
  POLLING_INTERVAL,
  writeAddress,
  setAutoInterval,
  emitToEvent,
  methodNameKey,
}): void => {

  useEffect(() => {
    if (autoInvokeKey && readChainId === info?.contract?.networkId) {
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }

      if (autoInvokeValue === 'true' && !isTransaction) {
        const intervalId = setInterval(() => {
          emitToEvent(
            EVENT_NAMES.contract.invokeTrigger,
            { value: null, step: 'Auto invoke transtacion method.', status: EVENT_STATUS.resolved, methodNameKey },
          )
          handleRunMethod(null, true)
        }, POLLING_INTERVAL)

        setAutoInterval(intervalId)

        return (): void => clearInterval(intervalId)
      }
    }
  }, [ readEnabled, readContract, writeAddress ])

  return null
}
