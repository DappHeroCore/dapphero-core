import { useEffect } from 'react'
import omit from 'lodash.omit'

export const useAddInvokeTrigger = ({ info, autoClearKey, handleRunMethod, parameters }) => {

  const { childrenElements } = info
  useEffect(() => {
    const autoClearValue = autoClearKey?.value || false
    const invokeButtons = childrenElements.filter(({ id }) => id.includes('invoke'))

    const ethValue = parameters?.EthValue
    const parsedParameters = omit(parameters, 'EthValue')
    const parametersValues = Object.values(parsedParameters)

    const onRunMethod = (event) => handleRunMethod(event, autoClearValue, parametersValues, ethValue)

    if (invokeButtons) {
      invokeButtons.forEach(({ element }) => {
        element.removeEventListener('click', onRunMethod)
        element.addEventListener('click', onRunMethod)
      })
    }

    return (): void => invokeButtons.forEach(({ element }) => element.removeEventListener('click', onRunMethod))
  }, [ handleRunMethod, parameters ])

  return null
}
