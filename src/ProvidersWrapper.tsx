import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { ToastProvider } from 'react-toast-notifications'
import get from 'lodash.get'
import { CookiesProvider } from 'react-cookie'
import { Web3ReactProvider } from '@web3-react/core'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'
import { ethers } from 'ethers'
import * as consts from 'consts'
import { DomElementsContext, EthereumContext } from 'contexts'
import { EmitterProvider } from 'providers/EmitterProvider/provider'

import { Web3Provider } from 'ethers/providers'

import { useInterval } from './utils/useInterval'
import { useProvider } from './hooks/useProvider'
import { useWeb3Provider } from './providers/ethereum/useWeb3Provider'

import { Activator } from './Activator'
import { logger } from './logger/customLogger'

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

const APP_REFRESH_SPEED = 4000
export const ProvidersWrapper: React.FC = () => {
  // react hooks
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)
  const [ timestamp, setTimestamp ] = useState(+new Date())
  const [ supportedNetworks, setSupportedNetworks ] = useState([])

  const retriggerEngine = (): void => setTimestamp(+new Date())
  const ethereum = useWeb3Provider(APP_REFRESH_SPEED) // This sets refresh speed of the whole app

  // load contracts effects
  useEffect(() => {
    (async () => {
      const newConfig = { contracts: await api.dappHero.getContractsByProjectKey(consts.global.apiKey) }
      setConfig(newConfig)
    })()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getSupportedNetworks = () => {
      const networks = configuration.contracts?.map(({ contractName, networkId: chainId }) => ({
        contractName,
        chainId,
      }))
      setSupportedNetworks(networks)
    }

    if (configuration?.contracts) getSupportedNetworks()
  }, [ configuration ])

  useEffect(() => {
    if (configuration) setDomElements(getDomElements(configuration))
  }, [ configuration, supportedNetworks ])

  if (domElements != null) {
    return (
      <EmitterProvider>
        <CookiesProvider>
          <ToastProvider>
            <EthereumContext.Provider value={ethereum}>
              <DomElementsContext.Provider value={domElements}>
                <Activator configuration={configuration} retriggerEngine={retriggerEngine} />
              </DomElementsContext.Provider>
            </EthereumContext.Provider>
          </ToastProvider>
        </CookiesProvider>
      </EmitterProvider>
    )
  }
  return null
}
