import React, { useState, useEffect, useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'
import { ethers } from 'ethers'

// Hooks
import * as hooks from 'hooks'

// Utils
const getAbiMethodInputs = (abi, methodName) => {
  const method = abi.find(({ name }) => name === methodName)
  return method.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
}

// Reducer Component
export const Reducer = ({ info }) => {
  const { contract, childrenElements, properties, hasInputs, hasOutputs, modifiers } = info
  const { contractAddress, contractAbi } = contract

  const methodNameKey = properties.find(({ key }) => key === 'methodName')
  const contractKey = properties.find(({ key }) => key === 'contractName')

  const { value: methodName } = methodNameKey
  const { value: contractName } = contractKey

  // Custom Hooks
  hooks.useEagerConnect()
  const injectedContext = hooks.useDappHeroWeb3()

  const { addToast } = useToasts()
  const displayToast = ({ message }: Error) => addToast(message, { appearance: 'error' })

  // States
  const [ context, setcontext ] = useState(injectedContext)
  const [ result, setResult ] = useState(null)
  const [ runMethod, setRunMethod ] = useState(null)
  const [ getGasLimit, setGetGasLimit ] = useState(null)
  const [ parameters, setParameters ] = useState(getAbiMethodInputs(info.contract.contractAbi, methodName))

  // -> Handlers
  const handleRunMethod = useCallback(async (method, methodParametersMap) => {
    if (!method) return console.error(`No method to run yet`)

    const parametersValues = Object.values(methodParametersMap)

    if (hasInputs) {
      const isParametersFilled = Boolean(parametersValues.filter(Boolean).join(''))
      if (!isParametersFilled) return console.error(`You must define your parameters first`)
    }

    try {
      const methodParams = [ ...(hasInputs ? parametersValues : []) ]

      // TODO: Get gas limit through ethers, and remove MAX_LIMIT
      // const gasLimit = await getGasLimit(...methodParams)
      const methodResult = await method(...methodParams)

      setResult(methodResult)
    } catch (error) {
      displayToast(error)
    }
  }, [ ])

  // -> Effects
  useEffect(() => {
    setcontext(injectedContext)
  }, [ injectedContext.networkId ])
  const { lib } = context

  // Create contract instance and set new method to trigger afterward in button
  useEffect(() => {
    if (lib) {
      const signer = new ethers.providers.Web3Provider(lib.provider).getSigner()
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer)

      if (contractInstance[methodName]) {
        const methodToRun = () => contractInstance.functions[methodName]
        const getterGasLimit = () => contractInstance.estimate[methodName]

        setRunMethod(methodToRun)
        setGetGasLimit(getterGasLimit)
      } else {
        console.error(`Method "${methodName}" does not exists on contract "${contractName}"`)
      }
    }
  }, [ lib ])

  // Add triggers to input elements
  useEffect(() => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))

    if (inputChildrens.length > 0) {
      const [ inputs ] = inputChildrens

      inputs.element.forEach(({ element, argumentName }) => {
        element.addEventListener('input', ({ target: { value } }) => {
          setParameters((prevParameters) => ({ ...prevParameters, [argumentName]: value }))
        })
      })
    }
  }, [ childrenElements ])

  // Add trigger to invoke buttons
  useEffect(() => {
    const invokeButtons = childrenElements.filter(({ id }) => id.includes('invoke'))

    if (invokeButtons) {
      invokeButtons.forEach(({ element }) => element.addEventListener('click', () => handleRunMethod(runMethod, parameters)))
    }
  }, [ childrenElements, runMethod, parameters ])

  // Display new results in the UI
  useEffect(() => {
    if (result) {
    // TODO: Check output type
      let parsedValue = result

      // Handle modifiers
      modifiers.forEach(({ key, value }) => {
        if (key === 'units') {
          if (value === 'ether') parsedValue = ethers.utils.formatEther(parsedValue)
        }
        if (key === 'decimals') parsedValue = Number(parsedValue).toFixed(value)
      // if (key === 'display') {}  Handle short and full values
      })

      // TODO: Check if result is an object and check if there's an output-name with one of those key names
      // Insert result in all output elements
      const outputs = childrenElements.filter(({ id }) => id.includes('output'))
      outputs.forEach(({ element }) => Object.assign(element, { textContent: parsedValue }))
    }
  }, [ result ])

  return null
}
