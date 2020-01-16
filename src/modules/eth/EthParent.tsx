import React, { FunctionComponent } from 'react'
import ErrorBoundary from 'react-error-boundary'
import { element } from 'prop-types'
import { Request, DappHeroConfig, RequestString, ModuleTypes } from '../types'
import { EthStaticView } from './EthStaticView'
import { EthContractParent } from './EthContractParent'
import { OpenSeaParent } from '../opensea/OpenSeaParent'
import { ThreeBoxParent } from '../3-box/ThreeBoxParent'
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
const errorHandlerEthContractParent = (
  error: Error,
  componentStack: string
) => {
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

/**
 * This functional component serves as a reducer for all the request strings which fall under the
 * module name "eth". For each request string which is filtered through EthParent, we render a component
 * submodule that matches the request. In this way we create a subtree of react components designed to
 * handle the requirements of each particular eth sub request module.
 * @param param
 */
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
      const sanitizedRequestString = requestString.filter((rs) => !signifierValues.includes(rs.slice(RequestString.SIGNIFIER_LENGTH)))
      request.requestString = sanitizedRequestString

      const isSanitizedContractRequestString = config.contracts
        .map((contract) => contract.contractName)
        .includes(sanitizedRequestString[RequestString.ETH_PARENT_TYPE])
        ? sanitizedRequestString[RequestString.ETH_PARENT_TYPE]
        : null

      switch (sanitizedRequestString[RequestString.ETH_PARENT_TYPE]) {
      /**
         * The below stacked case's are designed so that an match on any of the following falls through
         * to the default handler: EthStaticView
         */
      case ModuleTypes.ADDRESS:
      case ModuleTypes.GET_BALANCE:
      case ModuleTypes.GET_PROVIDER:
      case ModuleTypes.GET_NETWORK_NAME:
      case ModuleTypes.GET_NETWORK_ID:
        if (connected && accounts.length > 0) {
          // TODO: Here we will attach metrics to identify which was used.
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
      case isSanitizedContractRequestString: // Is set to the correct value IFF the name exists in the array of contract names
        if (connected && accounts.length > 0) {
          const mock = config.contracts.filter((contract) => contract.contractName === requestString[RequestString.ETH_PARENT_TYPE])[0]
          return (
            <ErrorBoundary onError={errorHandlerEthContractParent}>
              <EthContractParent
                request={request}
                injected={injected}
                element={request.element}
                signifiers={signifiers}
                mock={mock}
              />
            </ErrorBoundary>
          )
        }
        break
      case ModuleTypes.ENABLE:
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

      case ModuleTypes.OPENSEA:
        if (connected && accounts.length) {
          return (
            <ErrorBoundary>
              <OpenSeaParent
                request={request}
                injected={injected}
                signifiers={signifiers}
                element={request.element}
              />
            </ErrorBoundary>
          )
        }
        break

      case ModuleTypes.THREE_BOX: {
        if (connected && accounts.length) {
          return (
            <ThreeBoxParent
              account={accounts[0]}
              request={request}
              element={request.element}
              signifiers={signifiers}
              injected={injected}
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
