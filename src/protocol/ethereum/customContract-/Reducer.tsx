import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { ethers } from 'ethers'
import omit from 'lodash.omit'

// Hooks
import * as hooks from 'hooks'

// Utils
const getAbiMethodInputs = (abi, methodName) => {
  const method = abi.find(({ name }) => name === methodName)
  return method.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
}

// Reducer Component
export const Reducer = ({ info }) => {
  const { contract, childrenElements, properties, hasInputs, hasOutputs, isTransaction, modifiers } = info
  const { contractAddress, contractAbi } = contract

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
  const handleRunMethod = async () => {
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

      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer)

      if (isTransaction) {
        const options = { to: '', value: ethers.utils.parseEther(value) }
        const tx = await signer.sendTransaction(options)
        setResult(tx)
      } else {
        const method = contractInstance.functions[methodName]
        const methodResult = await method(...methodParams)
        setResult(methodResult)
      }
    } catch (error) {
      displayToast(error)
    }
  }

  // -> Effects
  useEffect(() => {
    setcontext(injectedContext)
  }, [ injectedContext.networkId ])

  // Add triggers to input elements
  useEffect(() => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))

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
      outputs.forEach(({ element }) => Object.assign(element, { textContent: parsedValue }))
    }
  }, [ result ])

  return null
}
