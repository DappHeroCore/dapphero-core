import { logger } from 'logger/logger'
import React, { FunctionComponent } from 'react'
import { EthContractProps } from '../../types/types'

type EthContractEventProps = EthContractProps & {
  //
};

export const EthContractEvent: FunctionComponent<EthContractEventProps> = ({
  instance,
  injected,
  method,
  element,
  request,
}) => {
  const { name } = method

  // TODO: add filters
  instance.events[name]()
    .on('data', (event) => {
      element.innerText = 'Transaction Confirmed!'
    })
    .on('error', (error) => {
      console.log('error', error)
    })

  return null
}
