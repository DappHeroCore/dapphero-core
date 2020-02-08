import React, { useContext } from 'react'
import * as hooks from 'hooks'
import { logger } from 'logger/customLogger'
import { loggerTest } from 'logger/loggerTest'
import * as contexts from 'contexts'
import * as consts from 'consts'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

// Log tests and Startup Logs
loggerTest()

export const Activator = ({ configuration }) => {
  const domElements = useContext(contexts.DomElementsContext)

  const attemptedEagerConnect = hooks.useEagerConnect()

  if (attemptedEagerConnect) {
    return (
      <>
        {domElements
          && domElements.map((domElement) => (
            <FeatureReducer
              key={domElement.id}
              element={domElement.element}
              feature={domElement.feature}
              configuration={configuration}
              info={domElement}
            />
          ))}
      </>
    )
  }
  return null
}
