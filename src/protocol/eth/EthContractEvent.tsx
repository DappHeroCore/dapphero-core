import { logger } from 'logger'
import React, { FunctionComponent } from 'react'
import { EthContractProps } from '../types'

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
      logger.debug('error', error)
    })

  return null
}
