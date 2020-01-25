import { useState } from 'react'
import {
  sendTransactionToContract,
  getTxFieldInputs,
  addClickHandlerToTriggerElement,
} from './utils'

interface DynamicCustomContractProps {
  element: HTMLElement
  signature: string
  abi: any[]
  lib: any
  methodName: string
  contractInstance: any
}

export const DynamicMethod = ({
  element,
  signature,
  abi,
  lib,
  methodName,
  contractInstance,
}: DynamicCustomContractProps) => {
  const defaultState = {
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null,
  }
  const [ , setTxState ] = useState(defaultState)
  // TODO: [BS-15] flesh out this feature in future iteration
  const inputNodes = document.querySelectorAll(`[id*=${methodName}]`)

  const methodObj = abi.reduce((acc, item) => (item.signature === signature ? item : acc), {})

  const sendTransaction = (e) => {
    e.preventDefault()
    const from = lib.givenProvider.selectedAddress
    const networkId = Number(lib.givenProvider.networkVersion)
    const { inputArgs, payableValue } = getTxFieldInputs(inputNodes, abi, methodObj)

    sendTransactionToContract(
      contractInstance,
      signature,
      inputArgs,
      from,
      setTxState,
      methodObj,
      networkId,
      payableValue,
    )
  }

  addClickHandlerToTriggerElement(element, sendTransaction)

  return null
}
