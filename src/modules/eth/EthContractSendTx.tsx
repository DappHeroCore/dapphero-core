import React, { useEffect, useState, FunctionComponent, useMemo } from 'react'
import $ from 'jquery'
import { EthContractProps } from '../types'
import {
  getTxFieldInputs,
  sendTransactionToContract,
  getTriggerElement,
  getUserLoadedElements
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

  const position = request.requestString.indexOf(method.name)

  const originalDomElement = element

  useEffect(() => {
    const { txProcessingElement, txConfirmedElement } = getUserLoadedElements()

    const updateState = () => {
      const { transactionHash, receipt } = txState

      // tx sent
      if (transactionHash && !receipt) {
        const el = document.getElementById(element.id) // send button

        if (txProcessingElement) { // user-loaded element
          const txProcessingEl = txProcessingElement.cloneNode(true);
          (txProcessingEl as HTMLElement).style.display = 'block'
          $(el).replaceWith((txProcessingEl as HTMLElement))
          $(el.id).prop('id', transactionHash)
        } else {
          if (el) {
            $(el.id).prop('disabled', true)
            el.id = transactionHash
            el.innerText = 'Processing...'
          }
        }
      }

      // tx confirmed
      if (transactionHash && receipt) {
        const el = document.getElementById(transactionHash)

        let txConfirmedEl
        if (txConfirmedElement && el) {
          txConfirmedEl = txConfirmedElement.cloneNode(true);
          (txConfirmedEl as HTMLElement).style.display = 'block'
          $(el).replaceWith(txConfirmedEl)
        } else if (el) {
          el.innerText = 'Confirmed!'
        }

        if (el) {
          setTimeout(() => {
            const replaceEl = document.getElementById(transactionHash)
            $(replaceEl).replaceWith(originalDomElement)
          }, 5000) // add this to constants file

        }
      }
    }
    updateState()
  }, [ defaultState ])

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
          }, 10000) // add this to CONSTANTS file
        }

        const triggerElement = getTriggerElement(
          requests,
          method.name,
          position
        )

        if (triggerElement) {
          const triggerClone = triggerElement.cloneNode(true)
          // TODO: clone element to remove all prev event listeners. is there a better way?
          triggerElement.parentNode.replaceChild(triggerClone, triggerElement)
          triggerClone.addEventListener('click', onClick)
        }

        return null
      }}
    </HTMLContextConsumer>
  )
}
