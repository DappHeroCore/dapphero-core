import React, { useEffect, useState, useCallback } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import { CookiesProvider } from 'react-cookie'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'
import * as consts from 'consts'
import { DomElementsContext, EthereumContext } from 'contexts'
import { EmitterProvider } from 'providers/EmitterProvider/provider'
import { useWeb3Provider } from 'hooks'
import userbase from 'userbase-js'
import { Activator } from './Activator'
import { UserBase as UBase } from './components/userBase/UserBase'

export const ProvidersWrapper: React.FC = () => {
  // react hooks
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)
  const [ timestamp, setTimestamp ] = useState(+new Date())
  const [ supportedNetworks, setSupportedNetworks ] = useState([])
  // TODO: [DEV-295] Correctly implement the pause behavior (Stop app from running)
  const [ isPaused, setPaused ] = useState(false)

  const retriggerEngine = (): void => { setTimestamp(+new Date()) }

  const ethereum = useWeb3Provider(consts.global.POLLING_INTERVAL) // This sets refresh speed of the whole app

  // load serBase
  // const [ db, setDB ] = useState(null)
  useEffect(() => {

    userbase.init({ appId: process.env.REACT_APP_USERBASE_APP_ID }).then((session) => {
      // SDK initialized successfully
      if (session.user) {
        // there is a valid active session
        // console.log(session.user.username)
      }
    }).catch((e) => console.error(e))

  }, [])

  // load contracts effects only if not paused
  useEffect(() => {
    const getConfig = async () => {
      const res = await api.dappHero.getContractsByProjectKey(consts.global.apiKey)
      const { formattedOutput, paused } = res
      const newConfig = { contracts: formattedOutput }
      // eslint-disable-next-line no-unused-expressions
      paused ? console.log('This DappHero project has been Paused (check Admin interface)') : setConfig(newConfig)
      setPaused(paused)
    }

    getConfig()
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

  // This needs to filter for Unique Contracts

  useEffect(() => {
    // TODO: Here is where we end up waiting for Config to load project
    if (configuration) {
      setDomElements(getDomElements(configuration))
    }
  }, [ configuration ])

  const [ smartcontractElements, setSmartContractElements ] = useState({ contractElements: null, domElementsFilteredForContracts: null })

  useEffect(() => {
    const run = (): void => {

      const newDomElements = getDomElements(configuration)
      const contractElements = newDomElements.filter((element) => element.feature === 'customContract')
      const getDomContractElements = (): Array<any> => {
        const filteredForContracts = newDomElements.filter((element) => element.feature !== 'customContract')
        return contractElements.length ? [ ...filteredForContracts, { id: contractElements[0].id, feature: 'customContract' } ] : filteredForContracts
      }
      const domElementsFilteredForContracts = getDomContractElements()
      setSmartContractElements({ contractElements, domElementsFilteredForContracts })
    }
    if (domElements && configuration) run()
  }, [ domElements, configuration, timestamp ])

  if (domElements != null) {

    return (
      <EmitterProvider>
        <CookiesProvider>
          <ToastProvider>
            <EthereumContext.Provider value={ethereum}>
              <UBase db={userbase} />
              <Activator
                configuration={configuration}
                setConfig={setConfig}
                domElements={domElements}
                retriggerEngine={retriggerEngine}
                timeStamp={timestamp}
                supportedNetworks={supportedNetworks}
                domElementsFilteredForContracts={smartcontractElements.domElementsFilteredForContracts}
                contractElements={smartcontractElements.contractElements}
                db={userbase}
              />
            </EthereumContext.Provider>
          </ToastProvider>
        </CookiesProvider>
      </EmitterProvider>
    )
  }
  return null
}
