import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import {
  getUserLoadedElements,
  getUserCustomTxStateNotification,
  sendTransactionToContract,
  getTxFieldInputs,
  addClickHandlerToTriggerElement,
} from '../../../../utils'

interface DynamicCustomContractProps {
  element: HTMLElement
  signature: string
  abi: any[]
  web3: Web3
  methodName: string
  contractInstance: any
}

export const Reducer = ({
  element,
  signature,
  abi,
  web3,
  methodName,
  contractInstance,
}: DynamicCustomContractProps) => {
  const defaultState = {
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null,
  }
  const [ txState, setTxState ] = useState(defaultState)
  // TODO: [BS-15] flesh out this feature in future iteration
  const inputNodes = document.querySelectorAll(`[id*=${methodName}]`)

  const methodObj = abi.reduce((acc, item) => (item.signature === signature ? item : acc), {})

  const sendTransaction = (e) => {
    e.preventDefault()
    const from = web3.givenProvider.selectedAddress
    const networkId = Number(web3.givenProvider.networkVersion)
    const { inputArgs, payableValue } = getTxFieldInputs(inputNodes, abi, methodObj)

    sendTransactionToContract(
      web3,
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
