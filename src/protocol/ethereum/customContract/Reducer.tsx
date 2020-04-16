import React, { useState, useContext } from 'react'
import { useToasts } from 'react-toast-notifications'
import Notify from 'bnc-notify'
import { ethers } from 'ethers'
import { logger } from 'logger/customLogger'
import * as contexts from 'contexts'
import { EmitterContext } from 'providers/EmitterProvider/context'

import { useAddTriggersToInputElements } from './useAddTriggersToInputElements'
import { useAddInvokeTrigger } from './useAddInvokeTrigger'
import { useAutoInvokeMethod } from './useAutoInvokeMethod'
import { useDisplayResults } from './useDisplayResults'

import { sendTx } from './sendTx'
import { callMethod } from './callMethod'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API
const POLLING_INTERVAL = 4000

// Utils
const notify = (apiKey, chainId) => Notify({ dappId: apiKey, networkId: chainId })

const getAbiMethodInputs = (abi, methodName): Record<string, any> => {
  const emptyString = '$true'
  const parseName = (value: string): string => (value === '' ? emptyString : value)

  const method = abi.find(({ name }) => name === methodName)
  const parsedMethod = Object.assign(method, { inputs: method.inputs.map((input) => ({ ...input, name: parseName(input.name) })) })

  const output = parsedMethod.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
  return output
}

// Reducer Component
export const Reducer = ({ info, readContract, writeContract }) => {

  const {
    childrenElements,
    properties,
    hasInputs,
    isTransaction,
  } = info

  // TODO Check for Overloaded Functions
  const autoClearKey = properties.find(({ key }) => key === 'autoClear')
  const autoInvokeKey = properties.find(({ key }) => key === 'autoInvoke')
  const methodNameKey = properties.find(({ key }) => key === 'methodName')
  const ethValueKey = properties.find((property) => property.key === 'ethValue')

  const { value: methodName } = methodNameKey

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Toast Notifications
  const { addToast } = useToasts()
  const errorToast = ({ message }): void => addToast(message, { appearance: 'error' })
  const infoToast = ({ message }): void => addToast(message, { appearance: 'info' })

  // States
  const [ result, setResult ] = useState(null)
  const [ parameters, setParameters ] = useState(getAbiMethodInputs(info.contract.contractAbi, methodName))

  // Create a write Provider from the injected ethereum context
  const { provider, isEnabled, chainId, address } = useContext(contexts.EthereumContext)

  // -> Handlers
  const handleRunMethod = async (event = null, shouldClearInput = false, parametersValues, ethValue): Promise<void> => {

    if (event) {
      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (err) {}
    }

    if (hasInputs) {
      const isParametersFilled = Boolean(parametersValues.filter(Boolean).join(''))
      if (!isParametersFilled) console.error(`You must define your parameters first`)
    }

    try {
      let value = '0'
      const methodParams = [ ...(hasInputs ? parametersValues : []) ]
      if (ethValueKey || ethValue) {
        value = ethValueKey?.value || ethValue
      }
      if (isTransaction && isEnabled && writeContract) {
        sendTx(writeContract, provider, methodName, methodParams, value, setResult, notify(blockNativeApiKey, chainId))
      } else {
        callMethod(readContract, methodName, methodParams, setResult, infoToast)
      }

      const [ input ] = childrenElements.filter(({ id }) => id.includes('input'))
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }
      const shouldAutoInvoke = autoInvokeValue === 'true'
      const shouldClearAllInputValues = input?.element && !shouldAutoInvoke && shouldClearInput

      if (shouldClearAllInputValues) {
        input.element.forEach(({ element }) => Object.assign(element, { value: '' }))
      }

    } catch (err) {
      logger.error('Custom Contract handleRun method failed\n', err)
      errorToast({ message: 'Error. Check the Console.' })
    }
  }

  // Add triggers to input elements
  useAddTriggersToInputElements(info, ethValueKey, setParameters, address)

  // Add trigger to invoke buttons
  useAddInvokeTrigger(info, autoClearKey, handleRunMethod, parameters)

  // Auto invoke method
  useAutoInvokeMethod(info, autoInvokeKey, autoClearKey, isTransaction, handleRunMethod, parameters, chainId, POLLING_INTERVAL)

  // Display new results in the UI
  useDisplayResults(childrenElements, result, emitToEvent)

  return null
}
