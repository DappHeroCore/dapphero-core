import React, { useEffect, useState, FunctionComponent, useMemo } from 'react' //eslint-disable-line
import $ from 'jquery'
import { EthContractProps, FunctionTypes } from '../types'
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
// 0x885583955F14970CbC0046B91297e9915f4DE6E4 //test addr
export const EthContractSendTx: FunctionComponent<EthContractSendTxProps> = ({
  instance,
  method,
  request,
  injected,
  element,
  signifiers
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

  const elId = 'replace' // button => processing element => confirmed element => button

  useEffect(() => {
    const { txProcessingElement, txConfirmedElement } = getUserLoadedElements()

    const updateState = () => {
      const { transactionHash, receipt } = txState

      // tx sent
      if (transactionHash && !receipt) {
        const el = document.getElementById(element.id) // send button

        if (txProcessingElement) {
          // user-loaded element
          const txProcessingEl = txProcessingElement.cloneNode(true) as HTMLElement
          txProcessingEl.style.display = 'block'
          txProcessingEl.id = elId
          el.parentNode.replaceChild(txProcessingEl, el)
        } else {
          if (el) {
            $(el.id).prop('disabled', true)
            el.id = elId
            el.innerText = 'Processing...'
          }
        }
      }

      // tx confirmed
      if (transactionHash && receipt) {
        const el = document.getElementById(elId)

        let txConfirmedEl
        if (txConfirmedElement && el) {
          txConfirmedEl = txConfirmedElement.cloneNode(true);
          (txConfirmedEl as HTMLElement).style.display = 'block'
          txConfirmedEl.id = elId
          el.parentElement.replaceChild(txConfirmedEl, el)
        } else if (el) {
          el.innerText = 'Confirmed!'
        }

        const replaceEl = document.getElementById(elId)

        setTimeout(() => {
          const newOriginal = originalDomElement.cloneNode(true)
          replaceEl.replaceWith(newOriginal)
          setTxState(defaultState)
        }, 5000) // add this to constants file
      }
    }
    updateState()
  }, [ defaultState ])

  return (
    <HTMLContextConsumer>
      {({ requests }) => {
        const { signature } = method

        const onClick = async () => {
          const { inputFields, txArgArray, valueArg } = getTxFieldInputs(
            requests,
            position,
            method.name,
            method
          )
          console.log('inputfields', inputFields)
          console.log('txArgArray', txArgArray)
          console.log('valueArg', valueArg)

          await sendTransactionToContract(
            injected.lib,
            instance,
            signature,
            txArgArray,
            injected.accounts,
            setTxState,
            method,
            signifiers.payable || valueArg,
            injected.networkId
          )
          // TODO: Best way to clean input fields?
          // Timeout set because function needs to pull value first
          setTimeout(() => {
            inputFields.forEach((module) => {
              document.getElementById(module.element.id).value = null
            })
            return null
          }, 10000) // TODO: clean when tx confirms
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
