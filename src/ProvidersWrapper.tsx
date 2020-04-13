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
  const [ supportedNetworks, setSupportedNetworks ] = useState([])
  const [ appReady, setAppReady ] = useState(false)
  const retriggerEngine = (): void => setTimestamp(+new Date())

  const { provider: ethereum, addProvider, addSigner, addWriteProvider } = useProvider()

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
      const networks = configuration.contracts?.map((contract) => ({
        contractName: contract.contractName,
        chainId: contract.networkId,
      }))
      setSupportedNetworks(networks)
    }

    if (configuration?.contracts) getSupportedNetworks()
  }, [ configuration ])

  // add read provider
  useEffect(() => {
    const networkName = 'rinkeby'
    addProvider(ethers.getDefaultProvider(networkName))
  }, [])

  // add metamask if already enabled
  useEffect(() => {
    const tryMetamask = async () => {
      if (window.ethereum || window.web3) {
        try {
          const provider = new Web3Provider(window.ethereum || window.web3)
          const currentNetwork = await provider.ready
          const signer = provider.getSigner()
          const address = await signer.getAddress()
          logger.log(`Metamask is enabled, address: ${address}`)

          const onCorrectNetwork = supportedNetworks.find((network) => network.chainId === currentNetwork.chainId)
          console.log('tryMetamask -> onCorrectNetwork', onCorrectNetwork)
          if (!onCorrectNetwork) {
            console.log(`Metamask is on network ${currentNetwork.chainId.toString()} : ${consts.global.ethNetworkName[currentNetwork.chainId]}.`)
          }
          addSigner(signer, address, window.ethereum.enable || window.web3.enable)
          addWriteProvider(provider)
        } catch (err) {
          logger.log('Metamask is not enabled')
        }
      }
    }
    if (providerChoice === 'metamask') tryMetamask()
    window.ethereum.on('accountsChanged', tryMetamask)
    window.ethereum.on('networkChanged', tryMetamask)
  }, [ supportedNetworks ])

  useEffect(() => {
    if (configuration) setDomElements(getDomElements(configuration))
  }, [ configuration, supportedNetworks ])

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
