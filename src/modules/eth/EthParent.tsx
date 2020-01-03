import React, { FunctionComponent, useState, Fragment } from 'react'
import { Request, DappHeroConfig } from '../types'
import { EthStaticView } from './EthStaticView'
import { EthContractParent } from './EthContractParent'
import { EthereumContextConsumer } from '../../context/ethereum'
import { EthEnable } from '../eth/EthEnable'
import { EthEvent } from '../eth/EthEvent'

interface EthParentProps {
  request: Request;
  config: DappHeroConfig;
}

export const EthParent: FunctionComponent<EthParentProps> = ({
  request,
  config
}: EthParentProps) => (
  <EthereumContextConsumer>
    {({ connected, accounts, injected }) => {
      switch (
        request.requestString[2] // TODO Be explicit about the index
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
            />
          )
        }
        break
      }

      case config.contractName: {
        if (connected && accounts.length > 0) {
          return (
            <EthContractParent
              request={request}
              injected={injected}
              element={request.element}
            />
          )
        }

        break
      }
      case 'enable': {
        return (
          <EthEnable
            request={request}
            injected={injected}
            accounts={accounts}
          />
        )
        break
      }
      case 'event': {
        return (
          <EthEvent
            request={request}
            injected={injected}
            accounts={accounts}
            config={config}
          />
        )
        break
      }

      default:
        return null
      }
    }}
  </EthereumContextConsumer>
)
