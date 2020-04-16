import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'
import Notify from 'bnc-notify'
import { ethers } from 'ethers'
import * as utils from 'utils'
import { logger } from 'logger/customLogger'
import omit from 'lodash.omit'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { EVENT_NAMES } from 'providers/EmitterProvider/constants'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { useWeb3Provider } from 'providers/ethereum/useWeb3Provider'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API
const POLLING_INTERVAL = 4000

// Utils
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
    contract,
    childrenElements,
    properties,
    properties_,
    hasInputs,
    hasOutputs,
    isTransaction,
    modifiers,
    modifiers_,
  } = info

  const { contractAddress, contractAbi, networkId } = contract
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

  // Create a write Provider from the injexted ethereum context
  const ethereum = useContext(contexts.EthereumContext)
  const { provider, signer, isEnabled, chainId, address } = ethereum

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

      // TODO: Test send eth value to method
      if (ethValueKey || ethValue) {
        value = ethValueKey?.value || ethValue
      }

      // TODO: Get gas limit through ethers, and remove MAX_LIMIT
      // const gasLimit = await getGasLimit(...methodParams)

      if (isTransaction && isEnabled && writeContract) {
        const currentNetwork = await signer.provider.getNetwork()
        const notify = Notify({
          dappId: blockNativeApiKey, // [String] The API key created by step one above
          networkId: currentNetwork.chainId, // [Integer] The Ethereum network ID your Dapp uses.
        })

        const method = writeContract.functions[methodName]

        const gasPrice = await provider.getGasPrice()

        const estimateMethod = writeContract.estimate[methodName]

        let estimatedGas
        const tempOverride = { value: ethers.utils.parseEther(value) }
        try {
          estimatedGas = await estimateMethod(...methodParams, tempOverride)
        } catch (err) {
          logger.error('estimateGasMethod failed', err)
        }

        const overrides = {
          gasLimit: estimatedGas,
          gasPrice,
          value: ethers.utils.parseEther(value),
        }
        let methodResult

        try {
          methodResult = await method(...methodParams, overrides)
          // BlockNative Toaster to track tx
          notify.hash(methodResult.hash)

          // Log transaction to Database
          logger.log(methodResult)

          // Set Result on State
          setResult(methodResult.hash)
        } catch (err) {
          logger.info('invoke contract method failed in transaction', err)
        }
      } else {
        const method = readContract.functions[methodName]
        try {
          const methodResult = await method(...methodParams)
          setResult(methodResult)
        } catch (err) {
          logger.info(
            'Invoke contract method failed in view.  This happends when a contract is invoked on the wrong network or when a contract is not deployed on the current network\n',
            err,
          )
          infoToast({ message: 'Invoking a contract function failed.  Are you on the right network?' })
        }
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
  useEffect(() => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))

    if (inputChildrens.length > 0) {
      const [ inputs ] = inputChildrens
      const tearDowns = inputs.element.map((input) => {
        const { element, argumentName } = input

        const clickHandlerFunction = (rawValue: string): void => {
          // I don't understand what this is doing. - dennison
          const value = address
            ? rawValue.replace(consts.clientSide.currentUser, address) ?? rawValue
            : rawValue

          try {
            const displayUnits = element.getAttribute('data-dh-modifier-display-units')
            const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
            const convertedValue = value && (displayUnits || contractUnits) ? utils.convertUnits(displayUnits, contractUnits, value) : value

            if (convertedValue) {
              setParameters((prevParameters) => ({
                ...prevParameters,
                [argumentName]: convertedValue,
              }))
            }
          } catch (err) {
            console.warn('There may be an issue with your inputs')
          }

          element.value = value
        }

        const ethValue = ethValueKey?.value

        clickHandlerFunction(element.value)

        const clickHandler = (event): void => {
          const rawValue = ethValue ?? event.target.value
          clickHandlerFunction(rawValue)
        }

        element.addEventListener('input', clickHandler)

        // Edge case where JS or jQuery uses .value property or .val() method
        const temporaryValue = null
        // const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')

        // Object.defineProperty(element, 'value', {
        //   get() {
        //     return get.call(this)
        //   },
        //   set(newVal) {
        //     set.call(this, newVal)

        //     if (temporaryValue !== newVal) {
        //       temporaryValue = newVal
        //       clickHandlerFunction(newVal)
        //     }

        //     return newVal
        //   },
        // })

        return (): void => {
          element.removeEventListener('input', clickHandler)
        }
      })

      return (): void => {
        tearDowns.forEach((cb) => cb())
      }
    }
  }, [ childrenElements, address ])

  // Add trigger to invoke buttons
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

  // Auto invoke method
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

  // Display new results in the UI
  useEffect(() => {
    if (result) {
      const parsedValue = result

      const outputsChildrenElements = childrenElements.find(({ id }) => id.includes('outputs'))
      const outputNamedChildrenElements = childrenElements.find(({ id }) => id.includes('outputName'))

      if (outputsChildrenElements?.element) {
        outputsChildrenElements.element.forEach(({ element }) => {

          if (typeof result === 'string' || typeof result === 'object') {
            const displayUnits = element.getAttribute('data-dh-modifier-display-units')
            const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
            const decimals = (element.getAttribute('data-dh-modifier-decimal-units')
                || element.getAttribute('data-dh-modifier-decimals'))
              ?? null

            const convertedValue = result && (displayUnits || contractUnits)
              ? utils.convertUnits(contractUnits, displayUnits, result)
              : result

            const isNumber = !Number.isNaN(Number(convertedValue))
            if (decimals && isNumber) {
              const decimalConvertedValue = Number(convertedValue)
                .toFixed(decimals)
                .toString()
              element.innerText = decimalConvertedValue
            } else {
              Object.assign(element, { textContent: convertedValue })
            }

            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: convertedValue, element })
          } else {
            Object.assign(element, { textContent: parsedValue })
            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: parsedValue, element })
          }

        })
      }

      if (outputNamedChildrenElements?.element) {
        outputNamedChildrenElements.element.forEach(({ element }) => {
          const outputName = element.getAttribute('data-dh-property-output-name')
          const displayUnits = element.getAttribute('data-dh-modifier-display-units')
          const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
          const decimals = (element.getAttribute('data-dh-modifier-decimal-units')
              || element.getAttribute('data-dh-modifier-decimals'))
            ?? null
          const convertedValue = parsedValue[outputName] && (displayUnits || contractUnits)
            ? utils.convertUnits(contractUnits, displayUnits, parsedValue[outputName])
            : parsedValue[outputName]
          const isNumber = !Number.isNaN(Number(convertedValue))

          if (decimals && isNumber) {
            const decimalConvertedValue = Number(convertedValue)
              .toFixed(decimals)
              .toString()
            element.innerText = decimalConvertedValue

            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: decimalConvertedValue, element })
          } else {
            Object.assign(element, { textContent: convertedValue })
            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: convertedValue, element })
          }
        })
      }

    }
  }, [ result ])

  return null
}
