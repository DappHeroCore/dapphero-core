import React from 'react'
import ErrorBoundary from 'react-error-boundary'
import { Request, DappHeroConfig } from './types'
import { EthParent } from './eth'
import { mockConfig } from './eth/mocks/mockConfig'

const getConfig = (): DappHeroConfig => {

  const configElement = document.getElementById('dh-config')
  // TODO Clean this data to prevent injections
  // const config: DappHeroConfig = JSON.parse(configElement.textContent)
  // Hide the Element if not hidden.
  const config = mockConfig
  if (configElement && configElement.style.display !== 'none') {
    configElement.style.display = 'none'
  }
  return config
}

// TODO: This is a temporary placement for the error handler. This should connect to the Database.
const myErrorHandler = (error: Error, componentStack: string) => {
  // Do something with the error
  // E.g. log to an error logging client here
}

// This increments a key so each element out of reducer has unique Key so react doesn't complain.
let reactKeyIndex = 0

// NOTE: Each case should have it's own error boundary.
export const reducer = (request: Request) => {
  switch (request.arg) {
  case 'eth': {
    const config = getConfig()
    reactKeyIndex += 1
    return (
      <ErrorBoundary key={reactKeyIndex} onError={myErrorHandler}>
        <EthParent request={request} config={config} />
      </ErrorBoundary>

    )
  }
  default:
    return null
  }
}
