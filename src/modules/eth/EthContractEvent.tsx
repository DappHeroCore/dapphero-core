import React, { useEffect, useState, FunctionComponent } from 'react'
import { EthContractProps, Signifiers } from '../types'

type EthContractEventProps = EthContractProps & {
  //
};

export const EthContractEvent: FunctionComponent<EthContractEventProps> = ({
  instance,
  injected,
  method,
  element,
  request
}) => {
  const { name } = method

  // TODO: add filters
  instance.events[name]()
    .on('data', (event) => {
      element.innerText = 'Transaction Confirmed!'
      element.style.color = 'blue'
    })
    .on('error', (error) => {
      console.log('error', error)
    })

  return null
}
