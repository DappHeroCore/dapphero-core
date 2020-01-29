import React, { useEffect, useState } from 'react'
import { logger } from 'logger/customLogger'
import * as api from 'api'
import * as hooks from 'hooks'
import { useWeb3React } from '@web3-react/core'
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
const elements = Array.from(document.querySelectorAll(`[id^=dh]`))
const apiKeyElement = document.getElementById('dh-apiKey')
const apiKey = apiKeyElement.getAttribute('data-api')

// TODO: if no apiKey then toast notification missing API key
logger.debug('logger', logger)
logger.debug('ScriptAPI: ', apiKey)

export const Activator = () => {
  const { active, error, activate, ...rest } = useWeb3React()
  logger.debug('web3ReactContext: ', { active, error, activate, ...rest })
  const [ configuration, setConfig ] = useState(null)
  // hooks.useEagerConnect()

  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectKey(apiKey) }
      setConfig(newConfig)
    })()
  }, [])
  if (configuration) {
    return (
      elements.map((element, index) => (<FeatureReducer key={element.id + index.toString()} element={element} configuration={configuration} index={index} />))
    )
  }
  return null
}
