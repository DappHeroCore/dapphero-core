import React, { useEffect, useState } from 'react'
import * as api from 'api'
import { featureReducer } from './protocol/ethereum/featureReducer'

const elements = Array.from(document.querySelectorAll(`[id^=dh]`))

export const App: React.FC = () => {
  const [ configuration, setConfig ] = useState(null)

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
