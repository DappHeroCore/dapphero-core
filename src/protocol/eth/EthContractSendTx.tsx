import React, { useEffect, useState, FunctionComponent } from 'react'; //eslint-disable-line
import { EthContractProps } from '../../types/types'
import {
  getTriggerElement,
  getUserLoadedElements,
  addClickHandlerToTriggerElement,
  sendTransactionWrapper,
  getUserCustomTxStateNotification,
} from './utils'

// TODO: This should be explicit and clarified.
type EthContractSendTxProps = EthContractProps & {
  // TODO: any more?
};

export const EthContractSendTx: FunctionComponent<EthContractSendTxProps> = ({
  instance,
  method,
  request,
  injected,
  element,
  signifiers,
}: EthContractSendTxProps) => {
  const defaultState = {
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null,
  }
  const [ txState, setTxState ] = useState(defaultState)
  const position = request.requestString.indexOf(method.name)
  const { txProcessingElement, txConfirmedElement } = getUserLoadedElements()
  const inputNodes = document.querySelectorAll(`[id*=${method.name}]`)

  // In cases where a user has their own custom elements that they would like to show when
  // executing a transaction, this function will automatically find those custom elements
  // and toggle their visiblity based on the state of a transaction.
  // Note that this useEffect() will run when the values of txState change.
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

  return null
  // <HTMLContextConsumer>
  //   {({ requests }) => {
  //     const { signature } = method

  //     // This function will initiate a transaction and subsequently clear any
  //     // input field values.
  //     // TODO: The action of clearing input field values should be seperated from
  //     // sending a transaction.
  //     const sendTransaction = () => {
  //       sendTransactionWrapper(
  //         requests,
  //         position,
  //         method,
  //         injected,
  //         instance,
  //         signature,
  //         setTxState,
  //         signifiers
  //       )
  //     }

  //     // Find the user defined element which will serve as a trigger for an action
  //     // IE: a button that will initiate a transaction to the blockchain.
  //     const triggerElement = getTriggerElement(
  //       requests,
  //       method.name,
  //       position
  //     )

  //     // This function adds a click handler to the trigger element from above.
  //     // This allows us to add interactivity to elements that a user identifies as
  //     // a trigger element.
  //     addClickHandlerToTriggerElement(triggerElement, sendTransaction)

  //     return null
  //   }}
  // </HTMLContextConsumer>

}
