import React, { useEffect, useState } from 'react'
import * as api from 'api'
import * as hooks from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

// <script src="https://internal-dev-dapphero.s3.amazonaws.com/main.js" id="dh-apiKey" data-api="1580240829051x132613881547456510"></script>
const elements = Array.from(document.querySelectorAll(`[id^=dh]`))
const apiKeyElement = document.getElementById('dh-apiKey')
const apiKey = apiKeyElement.getAttribute('data-api')

// TODO: if no apiKey then toast notification missing API key

export const Activator = () => {
  const { active, error, activate, ...rest } = useWeb3React()
  console.log('web3ReactContext: ', { active, error, activate, ...rest })
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
