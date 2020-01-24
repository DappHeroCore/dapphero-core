import React, { useEffect, useState } from 'react'
import {
  useDecimalAndDisplayFormat,
  callPublicMethodWithArgs,
  getTxFieldInputs,
  addClickHandlerToTriggerElement,
  parseIdTag,
} from '../utils'
import { getReturnElement } from './getReturnElement'

export const Reducer = ({
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
  const returnElement = getReturnElement(contractName, methodObj.name) // invoke element isn't same as return element

  const { returnValueName, decimals, display } = parseIdTag(returnElement.id)
  const inputArgs = () => getTxFieldInputs(inputNodes, abi, methodObj)

  const callContract = (e) => {
    e.preventDefault()
    callPublicMethodWithArgs(web3, contractInstance, signature, inputArgs(), setReturnValue, returnValueName)
  }

  addClickHandlerToTriggerElement(element, callContract)

  if (returnValue) {
    returnElement.innerHTML = useDecimalAndDisplayFormat(web3, returnValue, decimals, display)
  }

  return null
}
