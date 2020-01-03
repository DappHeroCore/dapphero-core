import React, { useEffect, useState, FunctionComponent } from 'react';
import { EthContractProps } from '../types';
import { getTxFieldInputs, sendTransactionToContract, getTriggerElement } from './utils';
import { HTMLContextConsumer } from '../../context/html';

type EthContractSendTxProps = EthContractProps & {
  // any more?
};

export const EthContractSendTx: FunctionComponent<EthContractSendTxProps> = ({
  instance,
  method,
  request,
  injected,
  element
}) => {
  const defaultState = {
    transactionHash: null,
    confirmations: null,
    receipt: null,
    error: null
  };
  const [txState, setTxState] = useState(defaultState);
  console.log("txState", txState) // state updated on txHash, receipt, error

  const position = request.requestString.indexOf(method.name);

  return (
    <HTMLContextConsumer>
      {({ requests }) => {
        const { signature } = method;

        const onClick = async() => {
          const { inputFields, txArgArray } = getTxFieldInputs(
            requests,
            position,
            method.name,
            method
          );

          await sendTransactionToContract(instance, signature, txArgArray, injected.accounts, setTxState)
          setTimeout(() => {
            inputFields.map(module => {
              (document.getElementById(module.element.id)).value = null
            })
          }, 1000)
        };

        let triggerElement = getTriggerElement(requests, method.name, position)
        triggerElement.addEventListener('click', onClick)
        return null;
      }}
    </HTMLContextConsumer>
  );
};
