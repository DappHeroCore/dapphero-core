import { useEffect } from 'react'

import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'

export const useAddInvokeTrigger = ({ info, autoClearKey, handleRunMethod, emitToEvent }): void => {
  const { childrenElements } = info

  useEffect(() => {
    const autoClearValue = autoClearKey?.value || false
    const invokeButtons = childrenElements.filter(({ id }) => id.includes('invoke'))
    const onRunMethod = (event): Promise<void> => handleRunMethod(event, autoClearValue)

    if (invokeButtons) {
      invokeButtons.forEach(({ element }) => {
        emitToEvent(EVENT_NAMES.contract.invokeTrigger, { element, step: 'Add invoke trigger to elements.', status: EVENT_STATUS.resolved })
        element.removeEventListener('click', onRunMethod)
        element.addEventListener('click', onRunMethod)
      })
    }

    return (): void => invokeButtons.forEach(({ element }) => element.removeEventListener('click', onRunMethod))
  }, [ handleRunMethod ])

  return null
}
