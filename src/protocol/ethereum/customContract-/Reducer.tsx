import React, { useState, useEffect } from 'react'
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
export const Reducer = ({ info, configuration }) => {
  console.log('info obj inside feature reducer', info)

  const { contract, childrenElements, properties, hasParameters } = info
  const { contractAddress, contractAbi } = contract

  const contractKey = properties.find(({ key }) => key === 'contractName')
  const methodKey = properties.find(({ key }) => key === 'methodName')

  const { value: contractName } = contractKey
  const { value: methodName } = methodKey

  // Custom Hooks
  hooks.useEagerConnect()
  const injectedContext = hooks.useDappHeroWeb3()

  const { addToast } = useToasts()
  const displayToast = ({ message }: Error) => addToast(message, { appearance: 'error' })

  // States
  const [ context, setcontext ] = useState(injectedContext)
  const [ runMethod, setRunMethod ] = useState(null)
  const [ getGasLimit, setGetGasLimit ] = useState(null)
  const [ parameters, setParameters ] = useState(getAbiMethodInputs(info.contract.contractAbi, methodName))

  // -> Handlers
  const handleRunMethod = async () => {
    if (!runMethod) return console.error(`No method to run yet`)

    const parametersValues = Object.values(parameters)

    if (hasParameters) {
      const isParametersFilled = Boolean(parametersValues.filter(Boolean).join(''))
      if (!isParametersFilled) return console.error(`You must define your parameters first`)
    }

    try {
      const methodParams = [ ...(hasParameters ? parametersValues : []) ]

      // TODO: Get gas limit through ethers, and remove MAX_LIMIT
      // const gasLimit = await getGasLimit(...methodParams)
      const result = await runMethod(...methodParams)

      // TODO: Check if result is an object and check if there's an output-name with one of those key names
      // Insert result in all output elements
      const outputs = childrenElements.filter(({ id }) => id.includes('output'))
      console.log('TCL: handleRunMethod -> output', outputs)
      outputs.forEach(({ element }) => Object.assign(element, { textContent: result }))
    } catch (error) {
      displayToast(error)
    }
  }

  // -> Effects
  useEffect(() => {
    setcontext(injectedContext)
  }, [ injectedContext.networkId ])
  const { lib } = context

  // Create contract and new method to trigger in button
  useEffect(() => {
    if (lib) {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
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
      invokeButtons.forEach(({ element }) => element.addEventListener('click', handleRunMethod))
    }
  }, [ childrenElements, handleRunMethod, parameters ])

  return null
}
