import React, { useEffect, useState } from 'react'
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
import { useProvider } from './hooks/useProvider'

import { Activator } from './Activator'
import { logger } from './logger/customLogger'

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

export const ProvidersWrapper: React.FC = () => {
  // react hooks
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)
  const [ timestamp, setTimestamp ] = useState(+new Date())
  const [ providerChoice, setProviderChoice ] = useState('metamask')
  const retriggerEngine = (): void => setTimestamp(+new Date())

  const { provider: ethereum, addProvider, addSigner } = useProvider()

  // add provider
  useEffect(() => {
    const networkName = 'rinkeby'
    addProvider(ethers.getDefaultProvider(networkName))
  }, [])

  // add metamask if already enabled
  useEffect(() => {
    const tryMetamask = async () => {
      if (window.ethereum || window.web3) {
        try {
          const signer = new Web3Provider(window.ethereum || window.web3).getSigner()
          const address = await signer.getAddress()
          logger.log(`Metamask is enabled, address: ${address}`)
          addSigner(signer, address, window.ethereum.enable || window.web3.enable)

        } catch (err) {
          logger.log('Metamask is not enabled')
        }
      }
    }
    if (providerChoice === 'metamask') tryMetamask()
    window.ethereum.on('accountsChanged', tryMetamask)
  }, [])

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

  if (domElements != null) {
    return (
      <EmitterProvider>
        <CookiesProvider>
          <ToastProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <EthereumContext.Provider value={ethereum}>
                <DomElementsContext.Provider value={domElements}>
                  <Activator configuration={configuration} retriggerEngine={retriggerEngine} />
                </DomElementsContext.Provider>
              </EthereumContext.Provider>
            </Web3ReactProvider>
          </ToastProvider>
        </CookiesProvider>
      </EmitterProvider>
    )
  }
  return null
}
