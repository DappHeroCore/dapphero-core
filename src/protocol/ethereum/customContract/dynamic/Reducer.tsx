import React, { useEffect, useState } from 'react'
import * as hooks from 'hooks'
import {
  sendTransactionToContract,
  getTxFieldInputs,
  addClickHandlerToTriggerElement,
} from '../../../../utils'

interface DynamicCustomContractProps {
  element: HTMLElement
  signature: string
  abi: any[]
  methodName: string
  contractInstance: any
}

export const Reducer = ({
  element,
  signature,
  abi,
  methodName,
  contractInstance,
}: DynamicCustomContractProps) => {
  const { lib, accounts, networkId } = hooks.useDappHeroWeb3()
  const [ txState, setTxState ] = useState({
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null,
  })
  // TODO: [BS-15] flesh out this feature in future iteration
  const inputNodes = document.querySelectorAll(`[id*=${methodName}]`)

  const methodObj = abi.reduce((acc, item) => (item.signature === signature ? item : acc), {})

  const sendTransaction = (e) => {
    e.preventDefault()
    const from = accounts[0]
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
