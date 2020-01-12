import React, { useEffect, FunctionComponent } from 'react' //eslint-disable-line
import ErrorBoundary from 'react-error-boundary'
import { EthContractProps, FunctionTypes, Signifiers } from '../types'
import { EthContractViewStatic } from './EthContractViewStatic'
import { EthContractViewArgs } from './EthContractViewArgs'
import { EthContractSendTx } from './EthContractSendTx'
import { EthContractEvent } from './EthContractEvent'

import { getBaseContractData } from './utils'
import { abi, contractAddress } from './mocks/mockConfig'

type EthContractParentProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'method' | 'instance'>
>;

const errorEthContractViewStatic = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(`Error: ${error}`)
  console.log(`StackTrace: ${componentStack}`)
}
const errorEthContractViewArgs = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(`Error: ${error}`)
  console.log(`StackTrace: ${componentStack}`)
}
const errorEthContractSendTx = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
  console.log(`Error: ${error}`)
  console.log(`StackTrace: ${componentStack}`)
}

export const EthContractParent: FunctionComponent<EthContractParentProps> = ({
  request,
  request: { requestString },
  injected,
  element,
  signifiers
}: EthContractParentProps) => {
  const { method, instance, methods } = getBaseContractData(
    requestString,
    abi,
    contractAddress,
    injected.lib
  )

  console.log("What are the signifiers: ", signifiers)
  if (instance && methods) {
    try {
      // TODO: Set up method for differentiating between functions
      // with same name and different number of args
      const func = methods.filter((m) => m.name === method)[0] // TODO: be explicit about this Zero.
      // TODO: figure out best way to listen to events
      // do we even need this outside of the current tx flow
      /* if (eventTrigger.length) { // component is an event listener
        return (
          <EthContractEvent
            instance={instance}
            injected={injected}
            method={func}
            element={element}
            request={request}
          />
        )
      } */

      if (!func) return null // unsupported method or module

      switch (func.stateMutability) {
      case FunctionTypes.VIEW: {
        // "view" func
        if (!func.inputs.length) {
          // no args

          return (
            <ErrorBoundary onError={errorEthContractViewStatic}>
              <EthContractViewStatic
                instance={instance}
                method={func}
                element={element}
                injected={injected}
                signifiers={signifiers}
              />
            </ErrorBoundary>

          )
        }
        return (
          <ErrorBoundary onError={errorEthContractViewArgs}>
            <EthContractViewArgs
              instance={instance}
              method={func}
              request={request}
              element={element}
              injected={injected}
              signifiers={signifiers}
            />
          </ErrorBoundary>

        )
      }

      case FunctionTypes.PAYABLE:
      case FunctionTypes.NONPAYABLE: {
        return (
          <ErrorBoundary onError={errorEthContractSendTx}>
            <EthContractSendTx
              method={func}
              element={element}
              request={request}
              injected={injected}
              instance={instance}
              signifiers={signifiers}
            />
          </ErrorBoundary>

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
