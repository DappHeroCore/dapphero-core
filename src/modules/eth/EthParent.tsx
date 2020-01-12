import React, { FunctionComponent, useState, Fragment } from 'react'
import ErrorBoundary from 'react-error-boundary'
import { Request, DappHeroConfig, RequestString } from '../types'
import { EthStaticView } from './EthStaticView'
import { EthContractParent } from './EthContractParent'
import { EthereumContextConsumer } from '../../context/ethereum'
import { EthEnable } from './EthEnable'
import { useSignifierParser } from './utils'

interface EthParentProps {
  request: Request;
  config: DappHeroConfig;
}

// TODO: Connect this up to an error tracking system
const errorHandlerEthStaticView = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(`Error: ${error}`)
  console.log(`StackTrace: ${componentStack}`)
}
const errorHandlerEthContractParent = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(`Error: ${error}`)
  console.log(`StackTrace: ${componentStack}`)
}
const errorHandlerEthEnable = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(`Error: ${error}`)
  console.log(`StackTrace: ${componentStack}`)
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
      case 'getNetworkId':
        if (connected && accounts.length > 0) {
          return (
            <ErrorBoundary onError={errorHandlerEthStaticView}>
              <EthStaticView
                request={request}
                injected={injected}
                accounts={accounts}
                signifiers={signifiers}
              />
            </ErrorBoundary>

          )
        }
        break
      case config.contractName: { // eslint-disable-line
        if (connected && accounts.length > 0) {
          return (
            <ErrorBoundary onError={errorHandlerEthContractParent}>
              <EthContractParent
                request={request}
                injected={injected}
                element={request.element}
                signifiers={signifiers}
              />
            </ErrorBoundary>

          )
        }
      }
        break
      case 'enable': { // eslint-disable-line
        if (!connected) {
          return (
            <ErrorBoundary onError={errorHandlerEthEnable}>
              <EthEnable
                request={request}
                injected={injected}
                accounts={accounts}
              />
            </ErrorBoundary>

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
