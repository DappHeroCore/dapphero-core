import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'

import get from 'lodash.get'
import { CookiesProvider } from 'react-cookie'
import { Web3ReactProvider } from '@web3-react/core'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'
import { ethers } from 'ethers'
import * as consts from 'consts'
import { DomElementsContext } from 'contexts'
import { EmitterProvider } from 'providers/EmitterProvider/provider'

import { Activator } from './Activator'
import { logger } from './logger/customLogger'

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

export const ProvidersWrapper: React.FC = () => {
  // react hooks
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)
  const [ timestamp, setTimestamp ] = useState(+new Date())

  // effects
  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectKey(consts.global.apiKey) }
      setConfig(newConfig)
    })()
  }, [])

  useEffect(() => {
    if (configuration) setDomElements(getDomElements(configuration))
  }, [ configuration ])

  const retriggerEngine = (): void => setTimestamp(+new Date())

  if (domElements != null) {
    return (
      <EmitterProvider>
        <CookiesProvider>
          <ToastProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <DomElementsContext.Provider value={domElements}>
                <Activator configuration={configuration} retriggerEngine={retriggerEngine} />
              </DomElementsContext.Provider>
            </Web3ReactProvider>
          </ToastProvider>
        </CookiesProvider>
      </EmitterProvider>
    )
  }
  return null
}
