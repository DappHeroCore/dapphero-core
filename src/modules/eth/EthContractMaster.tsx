import React, { useEffect, FunctionComponent } from 'react'
import { Request, DappHeroConfig } from '../types'
import { EthContractParent } from './EthContractParent'
import { EthEvent } from './EthEvent'

import contractABI from '../../abi/ERC20.json'
// TODO: from database and we need to be explicit
const contractAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH on Mainnet

enum MethodType {
  FUNCTION = 'function',
  EVENT = 'event'
}

interface EthContractMasterProps {
  request: Request;
  config: DappHeroConfig;
  injected: any; // build this type
  accounts: string[];
  element: HTMLElement;
}

export const EthContractMaster: FunctionComponent<EthContractMasterProps> = (props) => {
  const { request, config, injected, accounts, element } = props
  const module = request.requestString[2] // TODO: We should be explicit about our index

  console.log('THIS IS REAL')
  const reducer = (method) => {
    switch (method.type) {
    case MethodType.FUNCTION:
      console.log('Sending to ETHcontractPArent')
      return (
        <EthContractParent
          request={request}
          config={config}
          injected={injected}
          accounts={accounts}
          element={element}
          contractABI={contractABI}
          contractAddress={contractAddress}
        />
      )
    case MethodType.EVENT:
      console.log('Sending to EVENT')
      return (
        <EthEvent
          request={request}
          config={config}
          injected={injected}
          accounts={accounts}
          element={element}
          contractABI={contractABI}
          contractAddress={contractAddress}
        />
      )

    default:
      return null
    }
  }

  contractABI.forEach((method) => { reducer(method) })

  return null
}

export default EthContractMaster
