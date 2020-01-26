import React, { useEffect, useState } from 'react'
import * as api from 'api'
import { InjectedConnector } from '@web3-react/injected-connector'

import { useWeb3React } from '@web3-react/core'
import { featureReducer } from './protocol/ethereum/featureReducer'

const elements = Array.from(document.querySelectorAll(`[id^=dh]`))

export const Activator: React.FC = () => {
  const { active, error, activate, ...rest } = useWeb3React()
  const [ configuration, setConfig ] = useState(null)
  console.log('useweb3react obj', { active, error, activate, ...rest })
  useEffect(() => {
    const injected = new InjectedConnector({ supportedChainIds: [ 1, 3, 4 ] })
    activate(injected)
  }, [])

  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectUrl('test.com/dev') }
      setConfig(newConfig)
    })()

  }, [])
  if (configuration) {
    return (

      elements.map((element, index) => featureReducer(element, configuration, index))

    )
  }
  return null
}
