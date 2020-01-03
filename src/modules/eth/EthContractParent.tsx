import React, { useEffect, FunctionComponent } from 'react'
import { EthContractProps } from '../types'
import { EthContractViewStatic } from './EthContractViewStatic'
import { EthContractViewArgs } from './EthContractViewArgs'
import { EthContractSendTx } from './EthContractSendTx'

import { useContractInstance, useGetMethods } from './utils'

/* test area */
import ERC20 from '../../abi/ERC20.json' // from db
import DappHeroTest from '../../abi/DappHeroTest.json'
// from db
const contractAddressMock = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH on Mainnet
const contractAddressMockRopsten = '0xad6d458402f60fd3bd25163575031acdce07538d' // DAI on Ropsten
const dappHeroTestAddress = '0x8d02c8e873bb27335ffeec3d20bfa68aefba1785' // ropsten

// const abi = ERC20;
// const contractAddress = contractAddressMockRopsten;
const abi = DappHeroTest
const contractAddress = dappHeroTestAddress
/* test area */

enum FunctionTypes {
  VIEW = 'view',
  NONPAYABLE = 'nonpayable',
  PAYABLE = 'payable'
}

enum Signifiers {
  IDENTIFY_RETURN_VALUE = '*'
}

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
  const method = requestString[3]
  const instance = useContractInstance(abi, contractAddress, injected.lib)
  const methods = useGetMethods(abi, injected.lib)

  // user identifies which return value in case of multiple return
  // TODO: below is candidate for helper util
  const identifyReturnValue = requestString.filter((rs) => rs.startsWith(Signifiers.IDENTIFY_RETURN_VALUE)); // eslint-disable-line
  let identifiedReturnValue
  if (identifyReturnValue.length) {
    identifiedReturnValue = identifyReturnValue[0].split('*')[1]
  }

  if (instance && methods) {
    try {
      // TODO: Set up method for differentiating between functions
      // with same name and different number of args
      const func = methods.filter((m) => m.name === method)[0]

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
