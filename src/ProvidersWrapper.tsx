import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import { CookiesProvider } from 'react-cookie'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'
import * as consts from 'consts'
import { DomElementsContext, EthereumContext } from 'contexts'
import { EmitterProvider } from 'providers/EmitterProvider/provider'
import { useWeb3Provider } from 'hooks'
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

  // Figure out the networks the dapp supports by contracts
  useEffect(() => {
    const getSupportedNetworks = (): void => {
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
  }, [ configuration ])

  if (domElements != null) {

    return (
      <EmitterProvider>
        <CookiesProvider>
          <ToastProvider>
            <EthereumContext.Provider value={ethereum}>
              <Activator
                configuration={configuration}
                setConfig={setConfig}
                domElements={domElements}
                retriggerEngine={retriggerEngine}
                supportedNetworks={supportedNetworks}
              />
            </EthereumContext.Provider>
          </ToastProvider>
        </CookiesProvider>
      </EmitterProvider>
    )
  }
  return null
}
