import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import Notify from 'bnc-notify'
import { ethers } from 'ethers'
import { logger } from 'logger/customLogger'
import omit from 'lodash.omit'

// Hooks
import * as hooks from 'hooks'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API

// Utils
const getAbiMethodInputs = (abi, methodName) => {
  const method = abi.find(({ name }) => name === methodName)
  return method.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
}

// Reducer Component
export const Reducer = ({ info }) => {
  const { contract, childrenElements, properties, hasInputs, hasOutputs, isTransaction, modifiers } = info

  const { contractAddress, contractAbi } = contract

  // TODO Check for Overloaded Functions
  const autoInvokeKey = properties.find(({ key }) => key === 'autoInvoke')
  const methodNameKey = properties.find(({ key }) => key === 'methodName')
  const ethValueKey = properties.find((property) => property.key === 'ethValue')

  const { value: methodName } = methodNameKey

  // Custom Hooks
  hooks.useEagerConnect()
  const injectedContext = hooks.useDappHeroWeb3()

  const { addToast } = useToasts()
  const displayToast = ({ message }: Error) => addToast(message, { appearance: 'error' })

  // States
  const [ result, setResult ] = useState(null)
  const [ context, setcontext ] = useState(injectedContext)
  const [ parameters, setParameters ] = useState(getAbiMethodInputs(info.contract.contractAbi, methodName))

  // -> Handlers
  const handleRunMethod = async (event = null) => {
    if (event) {
      event.preventDefault()
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
          logger.debug(methodResult)

          // Set Result on State
          setResult(methodResult.hash)
        } catch (err) {
          logger.info('invoking method failed', err)
        }

      } else {
        const method = contractInstance.functions[methodName]
        const methodResult = await method(...methodParams)
        setResult(methodResult)
      }
      const [ input ] = childrenElements.filter(({ id }) => id.includes('input'))
      if (input?.element) {
        input.element.forEach(({ element }) => {
          element.value = ''
        })
      }
    } catch (err) {
      logger.error('Custom Contract handeRun method failed', err)
      console.error(err)
      displayToast({ message: 'Error. Check the Console.' })
    }
  }

  // -> Effects
  useEffect(() => {
    setcontext(injectedContext)
  }, [ injectedContext.networkId ])

  // Add triggers to input elements
  useEffect(() => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
    console.log('TCL: Reducer -> childrenElements', childrenElements)

    if (inputChildrens.length > 0) {
      const [ inputs ] = inputChildrens

      inputs.element.forEach(({ element, argumentName }) => {
        element.addEventListener('input', ({ target: { value } }) => {
          setParameters((prevParameters) => ({
            ...prevParameters,
            [argumentName]: value,
          }))
        })
      })
    }
  }, [ childrenElements ])

  // Add trigger to invoke buttons
  useEffect(() => {
    const invokeButtons = childrenElements.filter(({ id }) => id.includes('invoke'))

    if (invokeButtons) {
      invokeButtons.forEach(({ element }) => element.addEventListener('click', handleRunMethod))
    }

    return () => invokeButtons.forEach(({ element }) => element.removeEventListener('click', handleRunMethod))
  }, [ childrenElements, handleRunMethod ])

  // Auto invoke method
  useEffect(() => {
    if (autoInvokeKey) {
      const { value } = autoInvokeKey
      if (value === 'true' && !hasInputs && !isTransaction) handleRunMethod()
    }
  }, [ autoInvokeKey, handleRunMethod ])

  // Display new results in the UI
  useEffect(() => {
    if (result) {
      // TODO: Check output type
      let parsedValue = result

      // TODO: Handle modifiers
      modifiers.forEach(({ key, value }) => {
        if (key === 'units') {
          if (value === 'ether') {
            parsedValue = ethers.utils.formatEther(parsedValue)
          }
        }
        if (key === 'decimals') parsedValue = Number(parsedValue).toFixed(value)
        // if (key === 'display') {}  Handle short and full values
      })

      // TODO: Check if result is an object and check if there's an output-name with one of those key names
      // Insert result in all output elements
      const outputs = childrenElements.filter(({ id }) => id.includes('output'))
      console.log('TCL: outputs', outputs)

      outputs.forEach(({ element }) => Object.assign(element, { textContent: parsedValue }))
    }
  }, [ result ])

  return null
}
