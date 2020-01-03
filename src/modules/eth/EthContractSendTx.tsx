import React, { useEffect, useState, FunctionComponent } from 'react';
import { EthContractProps } from '../types';
import { getTxFieldInputs } from './utils';
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
    console.log("******")
    console.log("method:", method)
    console.log("request:", request)
    console.log("element:", element)

  const position = request.requestString.indexOf(method.name)
  console.log("position", position)  
  return (
    <HTMLContextConsumer>
      {({ elements, requests }) => {
          console.log("elements", elements)
          console.log("requests", requests)
        // const { signature } = method;
        // console.log("ETHCONTRACTSENDTX:elements", elements)
        // const { inputFields, txArgArray } = getTxFieldInputs(elements, position, method.name, method);
        // console.log("INPUTfields", inputFields)
        // console.log("txArgArray", txArgArray)
        return null;
      }}
    </HTMLContextConsumer>
  );
};
