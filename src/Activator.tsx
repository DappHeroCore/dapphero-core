import React, { useContext } from 'react'
import { logger } from 'logger/customLogger'
import { loggerTest } from 'logger/loggerTest'
import { useWeb3React } from '@web3-react/core'
import * as contexts from 'contexts'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

// Log tests and Startup Logs
loggerTest()

export const Activator = ({ configuration }) => {
  const { active, error, activate, ...rest } = useWeb3React()
  const domElements = useContext(contexts.DomElementsContext)

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

// {configuration
//   && elements.map((element, index) => {
//     /* Avoid running customContract feature */
//     if (element.getAttribute('id').includes('customContract')) return null

//     return (
//       <FeatureReducer
//         element={element}
//         index={index + 1}
//         configuration={configuration}
//         key={element.id + index.toString()}
//       />
//     )
//   })}
