import { useState, useContext, useEffect, useReducer } from 'react'
import { useToasts } from 'react-toast-notifications'
import { logger } from 'logger/customLogger'
import Notify from 'bnc-notify'
import omit from 'lodash.omit'

import * as utils from 'utils'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { EmitterContext } from 'providers/EmitterProvider/context'

import { useAddInvokeTrigger } from './useAddInvokeTrigger'
import { useAutoInvokeMethod } from './useAutoInvokeMethod'
import { useDisplayResults } from './useDisplayResults'
import { stateReducer, ACTION_TYPES } from './stateMachine'

import { sendTx } from './sendTx'
import { callMethod } from './callMethod'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API
const { AUTO_INVOKE_INTERVAL: POLLING_INTERVAL } = consts.global

// Utils
const notify = (apiKey, chainId) => Notify({ dappId: apiKey, networkId: chainId })

const getAbiMethodInputs = (abi, methodName, dispatch): Record<string, any> => {
  const emptyString = '$true'
  const parseName = (value: string): string => (value === '' ? emptyString : value)

  const method = abi.find(({ name }) => name === methodName)
  if (!method) {
    dispatch({
      type: ACTION_TYPES.malformedInputName,
      status: {
        error: true,
        msg: `The method name: { ${methodName} } is incorrect. Perhaps a typo in your html?`,
      },
    })
    return null
  }
  const parsedMethod = Object.assign(method, { inputs: method.inputs.map((input) => ({ ...input, name: parseName(input.name) })) })

  const output = parsedMethod.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
  return output
}

// Reducer Component
export const Reducer = ({ info, readContract, writeContract, readEnabled, readChainId, writeEnabled }) => {

  const initialState = { status: null, val: null }

  const [ state, dispatch ] = useReducer(stateReducer, initialState)
  state.isPolling ? null : console.log('Reducer -> state', state)

  // status object
  const [ status, setStatus ] = useState({ error: false, msg: '' })
  // const [ txStatus, dispatch ] = useState(null)

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

  let ethValue = ethValueKey?.value
  const { value: methodName } = methodNameKey

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Create a write Provider from the injected ethereum context
  const { provider, isEnabled, chainId, address } = useContext(contexts.EthereumContext)

  // Toast Notifications
  const { addToast } = useToasts()
  const errorToast = ({ message }): void => addToast(message, { appearance: 'error' })
  const infoToast = ({ message }): void => addToast(message, { appearance: 'info' })

  // React hooks
  const [ result, setResult ] = useState(null)
  const [ parametersValues, setParametersValues ] = useState([])
  const [ preventAutoInvoke, setPreventAutoInvoke ] = useState(false)
  const [ autoInterval, setAutoInterval ] = useState(null)

  // Stop AutoInvoke if the call is not working
  useEffect(() => {
    if (autoInterval && state.error) {
      clearInterval(autoInterval)
    }
  }, [ autoInterval, state.error ])

  // Helpers - Get parameters values
  const getParametersFromInputValues = (): Record<string, any> => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
    const abiMethodInputs = getAbiMethodInputs(info.contract.contractAbi, methodName, dispatch)

    if (!inputChildrens.length ) return { parameterValues: [] }
    const [ inputs ] = inputChildrens

    inputs.element.forEach(({ element, argumentName }) => {
      const rawValue = element.value
      const value = address ? (rawValue.replace(consts.clientSide.currentUser, address) ?? rawValue) : rawValue

      try {
        const displayUnits = element.getAttribute('data-dh-modifier-display-units')
        const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
        const convertedValue = value && (displayUnits || contractUnits) ? utils.convertUnits(displayUnits, contractUnits, value) : value

        if (convertedValue) {
          Object.assign(abiMethodInputs, { [argumentName]: convertedValue })
        }
      } catch (err) {
        console.warn('There may be an issue with your inputs')
      }

      // TODO: Check if we need to re-assign the input value (with Drake)
      element.value = value
    })

    if (abiMethodInputs?.EthValue) {
      ethValue = abiMethodInputs?.EthValue
    }

    const parsedParameters = omit(abiMethodInputs, 'EthValue')
    const parametersValues = Object.values(parsedParameters)

    return { parametersValues }
  }

  // Return values to their orignal value when unmounted
  // TODO: Ask @lndgalante if this is doing what I think it's doing.
  const [ originalValues, setOriginalValues ] = useState([])
  useEffect(() => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
    const getOriginalValues = () => {
      const [ inputs ] = inputChildrens
      const rawValues = inputs.element.map(({ element }) => ({ element, rawValue: element.value }))

      setOriginalValues(rawValues)

      return (): void => {
        for (const el of originalValues) {
          el.element.value = el.rawValue
        }
        return null
      }
    }
    if (inputChildrens.length) getOriginalValues()
  }, [])

  // -> Handlers
  const handleRunMethod = async (event = null, shouldClearInput = false, isPolling = false): Promise<void> => {
    if (event) {
      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (err) {}
    }

    // Return early if the read and write instances aren't ready
    // if (!readEnabled && !writeEnabled) return null

    const { parametersValues } = getParametersFromInputValues()

    if (hasInputs) {
      const isParametersFilled = Boolean(parametersValues.filter(Boolean).join(''))
      if (!isParametersFilled) console.error(`You must define your parameters first`)
    }

    try {
      let value = '0'
      const methodParams = [ ...(hasInputs ? parametersValues : []) ]

      if (ethValue) {
        value = ethValue
      }

      if (writeEnabled && isTransaction && !state.error) {
        const methodHash = await sendTx({
          writeContract,
          provider,
          methodName,
          methodParams,
          value,
          notify: notify(blockNativeApiKey, chainId),
          dispatch,
        })
        setResult(methodHash)
      } else if (readEnabled && !isTransaction && !state.error ) {
        if (methodParams.length) console.log('VIEW PARAMS: ', methodParams)
        const methodResult = await callMethod({ readContract, methodName, methodParams, infoToast, dispatch, isPolling })
        setResult(methodResult)
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

  // Add trigger to invoke buttons
  useAddInvokeTrigger({ info, autoClearKey, handleRunMethod })

  // Auto invoke method
  useAutoInvokeMethod({
    info,
    autoInvokeKey,
    autoClearKey,
    isTransaction,
    handleRunMethod,
    readEnabled,
    readContract,
    readChainId,
    POLLING_INTERVAL,
    writeAddress: address,
    parametersValues,
    preventAutoInvoke,
    setAutoInterval,
  })

  // Display new results in the UI
  useDisplayResults({ childrenElements, result, emitToEvent })

  return null
}
