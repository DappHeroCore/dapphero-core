import React, { useState, useEffect, useContext } from 'react'
import { useToasts } from 'react-toast-notifications'
import Notify from 'bnc-notify'
import { ethers } from 'ethers'
import * as utils from 'utils'
import { logger } from 'logger/customLogger'
import omit from 'lodash.omit'
import * as consts from 'consts'
import { useWeb3React } from '@web3-react/core'

import { EVENT_NAMES } from 'providers/EmitterProvider/constants'
import { EmitterContext } from 'providers/EmitterProvider/context'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API
const POLLING_INTERVAL = 1000

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
export const Reducer = ({ info, configuration }) => {
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

  const { contractAddress, contractAbi } = contract

  // TODO Check for Overloaded Functions
  const autoClearKey = properties.find(({ key }) => key === 'autoClear')
  const autoInvokeKey = properties.find(({ key }) => key === 'autoInvoke')
  const methodNameKey = properties.find(({ key }) => key === 'methodName')
  const ethValueKey = properties.find((property) => property.key === 'ethValue')

  const { value: methodName } = methodNameKey

  // Injected Web3 Context
  const injectedContext = useWeb3React()
  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Toast Notifications
  const { addToast } = useToasts()
  const errorToast = ({ message }): void => addToast(message, { appearance: 'error' })
  const infoToast = ({ message }): void => addToast(message, { appearance: 'info' })

  // States
  const [ result, setResult ] = useState(null)
  const [ parameters, setParameters ] = useState(getAbiMethodInputs(info.contract.contractAbi, methodName))

  // -> Handlers
  const handleRunMethod = async (event = null, shouldClearInput = false): Promise<void> => {
    if (event) {
      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (err) {}
    }

    const ethValue = parameters?.EthValue

    const parsedParameters = omit(parameters, 'EthValue')
    const parametersValues = Object.values(parsedParameters)

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

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer)
      const readOnlyContractInstance = new ethers.Contract(contractAddress, contractAbi, provider)

      if (isTransaction) {
        const currentNetwork = await signer.provider.getNetwork()
        const notify = Notify({
          dappId: blockNativeApiKey, // [String] The API key created by step one above
          networkId: currentNetwork.chainId, // [Integer] The Ethereum network ID your Dapp uses.
        })

        const method = contractInstance.functions[methodName]

        const gasPrice = await provider.getGasPrice()

        const estimateMethod = contractInstance.estimate[methodName]

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
        const method = readOnlyContractInstance.functions[methodName]
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

      if (input?.element && !shouldClearInput) {
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
          const value = injectedContext?.account
            ? rawValue.replace(consts.clientSide.currentUser, injectedContext.account) ?? rawValue
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
        let temporaryValue = null
        const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')

        Object.defineProperty(element, 'value', {
          get() {
            return get.call(this)
          },
          set(newVal) {
            set.call(this, newVal)

            if (temporaryValue !== newVal) {
              temporaryValue = newVal
              clickHandlerFunction(newVal)
            }

            return newVal
          },
        })

        return (): void => {
          element.removeEventListener('input', clickHandler)
        }
      })

      return (): void => {
        tearDowns.forEach((cb) => cb())
      }
    }
  }, [ childrenElements, injectedContext.account ])

  // Add trigger to invoke buttons
  useEffect(() => {
    const invokeButtons = childrenElements.filter(({ id }) => id.includes('invoke'))

    if (invokeButtons) {
      invokeButtons.forEach(({ element }) => element.addEventListener('click', handleRunMethod))
    }

    return (): void => invokeButtons.forEach(({ element }) => element.removeEventListener('click', handleRunMethod))
  }, [ childrenElements, handleRunMethod ])

  // Auto invoke method
  useEffect(() => {
    if (autoInvokeKey && injectedContext.chainId === info?.contract?.networkId) {
      const { value: autoInvokeValue } = autoInvokeKey
      const autoClearValue = autoClearKey?.value || false

      if (autoInvokeValue === 'true' && !isTransaction) {
        const intervalId = setInterval(() => handleRunMethod(null, autoClearValue), POLLING_INTERVAL)

        return (): void => clearInterval(intervalId)
      }
    }
  }, [ autoInvokeKey, autoClearKey, handleRunMethod ])

  // Display new results in the UI
  useEffect(() => {
    if (result) {
      const parsedValue = result

      const outputsChildrenElements = childrenElements.find(({ id }) => id.includes('output'))
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
