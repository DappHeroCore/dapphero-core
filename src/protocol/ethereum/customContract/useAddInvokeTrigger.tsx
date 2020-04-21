import { useEffect } from 'react'

export const useAddInvokeTrigger = ({ info, autoClearKey, handleRunMethod }): void => {
  const { childrenElements } = info

  useEffect(() => {
    const autoClearValue = autoClearKey?.value || false
    const invokeButtons = childrenElements.filter(({ id }) => id.includes('invoke'))
    const onRunMethod = (event): Promise<void> => handleRunMethod(event, autoClearValue)

    if (invokeButtons) {
      invokeButtons.forEach(({ element }) => {
        element.removeEventListener('click', onRunMethod)
        element.addEventListener('click', onRunMethod)
      })
    }

    return (): void => invokeButtons.forEach(({ element }) => element.removeEventListener('click', onRunMethod))
  }, [ handleRunMethod ])

  return null
}
