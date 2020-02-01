import React, { useEffect, useState } from 'react'
import { logger } from 'logger/customLogger'
import { useWeb3React } from '@web3-react/core'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

// <script src="https://internal-dev-dapphero.s3.amazonaws.com/main.js" id="dh-apiKey" data-api="1580240829051x132613881547456510"></script>
// const elements = Array.from(document.querySelectorAll(`[id^=dh]`))
const apiKeyElement = document.getElementById('dh-apiKey')
const apiKey = apiKeyElement.getAttribute('data-api')

// TODO: if no apiKey then toast notification missing API key
logger.debug('logger', logger)
logger.debug('ScriptAPI: ', apiKey)

export const Activator = () => {
  const { active, error, activate, ...rest } = useWeb3React()
  logger.debug('web3ReactContext: ', { active, error, activate, ...rest })

  const [ domElements, setDomElements ] = useState(null)
  const [ configuration, setConfig ] = useState(null)

  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectKey(apiKey) }
      setConfig(newConfig)
    })()
  }, [])

  useEffect(() => {
    if (configuration) setDomElements(getDomElements(configuration))
  }, [ configuration ])

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
