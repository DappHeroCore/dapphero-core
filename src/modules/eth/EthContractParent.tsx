import React, { useEffect, FunctionComponent } from 'react'
import { EthContractProps, FunctionTypes, Signifiers } from '../types'
import { EthContractViewStatic } from './EthContractViewStatic'
import { EthContractViewArgs } from './EthContractViewArgs'
import { EthContractSendTx } from './EthContractSendTx'
import { EthContractEvent } from './EthContractEvent'

import { getBaseContractData } from './utils'

// Mock Data
import {
  ERC20,
  DappHeroTest,
  contractAddressMock,
  contractAddressMockRopsten,
  dappHeroTestAddress,
  abi,
  contractAddress
} from './mocks/contractDataMock'
// End Mock Data

type EthContractParentProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'method' | 'instance'>
>;

export const EthContractParent: FunctionComponent<EthContractParentProps> = ({
  request,
  request: { requestString },
  injected,
  element
}: EthContractParentProps) => {
  let {
    method,
    instance,
    methods,
    identifiedReturnValue,
    eventTrigger
  } = getBaseContractData(requestString, abi, contractAddress, injected.lib)

  if (instance && methods) {
    try {
      if (eventTrigger.length) {
        method = method.split(Signifiers.EVENT_TRIGGER)[1]
      }

      // TODO: Set up method for differentiating between functions
      // with same name and different number of args
      const func = methods.filter((m) => m.name === method)[0]

      if (eventTrigger.length) { // component is an event listener
        return (
          <EthContractEvent
            instance={instance}
            injected={injected}
            method={func}
            element={element}
            request={request}
          />
        )
      }

      if (!func) return null // unsupported method or module

      switch (func.stateMutability) {
      case FunctionTypes.VIEW: {
        // "view" func
        if (!func.inputs.length) {
          // no args

          return (
            <EthContractViewStatic
              instance={instance}
              method={func}
              element={element}
              identifiedReturnValue={identifiedReturnValue}
            />
          )
        }
        return (
          <EthContractViewArgs
            instance={instance}
            method={func}
            request={request}
            element={element}
            injected={injected}
            identifiedReturnValue={identifiedReturnValue}
          />
        )
      }

      case FunctionTypes.NONPAYABLE: {
        return (
          <EthContractSendTx
            method={func}
            element={element}
            request={request}
            injected={injected}
            instance={instance}
          />
        )
      }

      default: {
        return null
      }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return null
}

export default EthContractParent
