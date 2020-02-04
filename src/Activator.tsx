import React, { useEffect, useState, useContext } from 'react'
import { logger } from 'logger/customLogger'
import { useWeb3React } from '@web3-react/core'
import * as contexts from 'contexts'

import * as api from 'api'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

const winston = require('winston')
const { Loggly } = require('winston-loggly-bulk')

winston.add(new Loggly({
  token: '0c02fa85-a311-4c99-9b0b-102b79ef16c2',
  subdomain: 'dapphero',
  tags: [ 'Winston-NodeJS' ],
  json: true,
}))

winston.log('info', 'Hello World from Node.js!')
console.log('we running')
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
