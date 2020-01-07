import React, { useEffect, FunctionComponent } from 'react'
import { EthContractProps, FunctionTypes, Signifiers } from '../types'
import { EthContractViewStatic } from './EthContractViewStatic'
import { EthContractViewArgs } from './EthContractViewArgs'
import { EthContractSendTx } from './EthContractSendTx'
import { EthContractEvent } from './EthContractEvent'

import { getBaseContractData } from './utils'

/* test area */

import ERC20 from '../../abi/ERC20.json' // from db
import DappHeroTest from '../../abi/DappHeroTest.json'
// from db
const contractAddressMock = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH on Mainnet
const contractAddressMockRopsten = '0xad6d458402f60fd3bd25163575031acdce07538d' // DAI on Ropsten
const dappHeroTestAddress = '0xd652a9c23f234fCee253aE9B8362d51d833f1e64' // ropsten

const abi = ERC20
const contractAddress = contractAddressMockRopsten
// const abi = DappHeroTest
// const contractAddress = dappHeroTestAddress

/* test area */

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
