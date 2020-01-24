import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import {
  getUserLoadedElements,
  getUserCustomTxStateNotification,
  sendTransactionToContract,
  getTxFieldInputs,
  addClickHandlerToTriggerElement,
} from '../utils'

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
  const { txProcessingElement, txConfirmedElement } = getUserLoadedElements()
  const inputNodes = document.querySelectorAll(`[id*=${methodName}]`)

  const methodObj = abi.reduce((acc, item) => (item.signature === signature ? item : acc), {})

  useEffect(() => {
    getUserCustomTxStateNotification(
      txState,
      setTxState,
      defaultState,
      txProcessingElement,
      txConfirmedElement,
      element,
    )
  }, [ txState ])

  const getInputs = () => getTxFieldInputs(inputNodes, abi, methodObj)

  const sendTransaction = (e) => {
    e.preventDefault()
    const from = web3.givenProvider.selectedAddress
    const networkId = Number(web3.givenProvider.networkVersion)
    const { inputArgs, payableValue } = getInputs()
    console.log('inputargs', inputArgs)
    console.log('payableValue', payableValue)

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
