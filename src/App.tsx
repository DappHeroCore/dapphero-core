import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import { DomElementsContext } from 'contexts'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'

import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Activator } from './Activator'

const apiKeyElement = document.getElementById('dh-apiKey')
const apiKey = apiKeyElement.getAttribute('data-api')

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

export const App: React.FC = () => {
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)

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
    <ToastProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <DomElementsContext.Provider value={domElements}>
          <Activator configuration={configuration} />
        </DomElementsContext.Provider>
      </Web3ReactProvider>
    </ToastProvider>
  )
}
