import React, { useEffect, useState, FunctionComponent, useMemo } from 'react'
import { EthContractProps } from '../types'
import {
  getTxFieldInputs,
  sendTransactionToContract,
  getTriggerElement
} from './utils'
import { HTMLContextConsumer } from '../../context/html'

type EthContractSendTxProps = EthContractProps & {
  // any more?
};
// 0x885583955F14970CbC0046B91297e9915f4DE6E4
export const EthContractSendTx: FunctionComponent<EthContractSendTxProps> = ({
  instance,
  method,
  request,
  injected,
  element
}: EthContractSendTxProps) => {
  const defaultState = {
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null
  }
  const [ txState, setTxState ] = useState(defaultState)
  console.log('txState', txState) // state updated on txHash, receipt, error

  const position = request.requestString.indexOf(method.name)

  return (
    <HTMLContextConsumer>
      {({ requests }) => {
        const { signature } = method

        const onClick = async () => {
          const { inputFields, txArgArray } = getTxFieldInputs(
            requests,
            position,
            method.name,
            method
          )

          await sendTransactionToContract(
            instance,
            signature,
            txArgArray,
            injected.accounts,
            setTxState
          )
          // TODO: Best way to clean input fields?
          // Timeout set because function needs to pull value first
          setTimeout(() => {
            inputFields.forEach((module) => {
              document.getElementById(module.element.id).value = null
            })
            return null
          }, 1000)
        }

        const triggerElement = getTriggerElement(requests, method.name, position)
        const triggerClone = triggerElement.cloneNode(true)
        // TODO: clone element to remove all prev event listeners
        triggerElement.parentNode.replaceChild(triggerClone, triggerElement)
        triggerClone.addEventListener('click', onClick)

        return null
      }}
    </HTMLContextConsumer>
  )
}
