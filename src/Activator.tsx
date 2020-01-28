import React, { useEffect, useState } from 'react'
import * as api from 'api'
import * as hooks from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

const elements = Array.from(document.querySelectorAll(`[id^=dh]`))

export const Activator = () => {
  const { active, error, activate, ...rest } = useWeb3React()
  console.log('web3ReactContext: ', { active, error, activate, ...rest })
  const [ configuration, setConfig ] = useState(null)
  hooks.useEagerConnect()

  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectUrl() }
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
