import React, { FunctionComponent, useState, Fragment } from 'react'
import { Request, DappHeroConfig, RequestString } from '../types'
import { EthStaticView } from './EthStaticView'
import { EthContractParent } from './EthContractParent'
import { EthereumContextConsumer } from '../../context/ethereum'
import { EthEnable } from '../eth/EthEnable'
import { useSignifierParser } from './utils'

interface EthParentProps {
  request: Request;
  config: DappHeroConfig;
}

export const EthParent: FunctionComponent<EthParentProps> = ({
  request,
  request: { requestString },
  config
}: EthParentProps) => (
  <EthereumContextConsumer>
    {({ connected, accounts, injected }) => {
      // pull out signifiers from request string
      const signifiers = useSignifierParser(requestString)
      const signifierValues = Object.values(signifiers)

      const sanitizedRequestString = requestString.filter((rs) => !signifierValues.includes(rs.slice(1)))
      request.requestString = sanitizedRequestString

      switch (
        sanitizedRequestString[RequestString.ETH_PARENT_TYPE]
      ) {
      case 'address': // TODO We shouldn't let this just fall through like this (I think)
      case 'getBalance': // TODO we should be explicit about how this works
      case 'getProvider': // TODO and maybe we should not need to hard code this but rather build a function which takes from database
      case 'getNetworkName':
      case 'getNetworkId': {
        if (connected && accounts.length > 0) {
          return (
            <EthStaticView
              request={request}
              injected={injected}
              accounts={accounts}
              signifiers={signifiers}
            />
          )
        }
      }
        break
      case config.contractName: { // eslint-disable-line
        if (connected && accounts.length > 0) {
          return (
            <EthContractParent
              request={request}
              injected={injected}
              element={request.element}
              signifiers={signifiers}
            />
          )
        }
      }
        break
      case 'enable': { // eslint-disable-line
        if (!connected) {
          return (
            <EthEnable
              request={request}
              injected={injected}
              accounts={accounts}
            />
          )
        }
        break
      }

      default:
        return null
      }
    }}
  </EthereumContextConsumer>
)
