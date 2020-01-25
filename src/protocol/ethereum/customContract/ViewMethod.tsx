import React, { useEffect, useState } from 'react'
import {
  useDecimalAndDisplayFormat,
  callPublicMethodWithArgs,
  getTxFieldInputs,
  addClickHandlerToTriggerElement,
  parseIdTag,
} from './utils'

export const ViewMethod = ({
  element,
  abi,
  signature,
  web3,
  methodName,
  contractInstance,
  contractName,
}) => {
  const [ returnValue, setReturnValue ] = useState('')
  const inputNodes = document.querySelectorAll(`[id*=${methodName}]`)

  const methodObj = abi.reduce((acc, item) => (item.signature === signature ? item : acc), {})
  const returnElement = document.querySelector(`[id*="view-name:${contractName}-methodName:${methodObj.name}-output"]`) // invoke element isn't same as return element

  const { returnValueName, decimals, display } = parseIdTag(returnElement.id)
  const inputArguments = () => getTxFieldInputs(inputNodes, abi, methodObj)

  const callContract = (e) => {
    e.preventDefault()
    const { inputArgs } = inputArguments()
    callPublicMethodWithArgs(web3, contractInstance, signature, inputArgs, setReturnValue, returnValueName)
  }

  addClickHandlerToTriggerElement(element, callContract)

  if (returnValue) {
    returnElement.innerHTML = useDecimalAndDisplayFormat(web3, returnValue, decimals, display)
  }

  return null
}
