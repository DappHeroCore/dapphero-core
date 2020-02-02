import React, { useEffect, useState, useContext } from 'react'
import { logger } from 'logger/customLogger'
import { useWeb3React } from '@web3-react/core'
import * as contexts from 'contexts'

import * as api from 'api'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

// <script src="https://internal-dev-dapphero.s3.amazonaws.com/main.js" id="dh-apiKey" data-api="1580240829051x132613881547456510"></script>
// const elements = Array.from(document.querySelectorAll(`[id^=dh]`))

export const Activator = ({ configuration }) => {
  const { active, error, activate, ...rest } = useWeb3React()
  logger.debug('web3ReactContext: ', { active, error, activate, ...rest })
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
