import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import { CookiesProvider } from 'react-cookie'
import { getDomElements } from '@dapphero/dapphero-dom'

import { ethers } from 'ethers'
import * as api from 'api'
import * as consts from 'consts'
import { DomElementsContext, EthereumContext } from 'contexts'
import { EmitterProvider } from 'providers/EmitterProvider/provider'
import { useWeb3Provider } from './providers/ethereum/useWeb3Provider'
import { Activator } from './Activator'

export const ProvidersWrapper: React.FC = () => {
  // react hooks
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)
  const [ timestamp, setTimestamp ] = useState(+new Date())
  const [ supportedNetworks, setSupportedNetworks ] = useState([])

  const retriggerEngine = (): void => setTimestamp(+new Date())
  const ethereum = useWeb3Provider(consts.global.POLLING_INTERVAL) // This sets refresh speed of the whole app

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
