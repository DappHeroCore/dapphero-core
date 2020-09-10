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

        // Call the run method instantly (100ms) before starting to poll.
        const timeout = setTimeout(() => handleRunMethod(null, true), 100)
        const intervalId = setInterval(() => {
          emitToEvent(
            EVENT_NAMES.contract.invokeTrigger,
            { value: null, step: 'Auto invoke transtacion method.', status: EVENT_STATUS.resolved, methodNameKey },
          )
          handleRunMethod(null, true)
        }, POLLING_INTERVAL)

        setAutoInterval(intervalId)

        const clear = (): void => {
          clearInterval(intervalId)
          clearTimeout(timeout)
        }
        return (): void => clear()
      }
    }
  }, [ readEnabled, readContract, writeAddress ])

  return null
}
