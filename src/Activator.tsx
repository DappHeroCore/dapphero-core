import React, { useContext, useEffect, useState, Fragment } from 'react'
import { useWeb3React } from '@web3-react/core'
import get from 'lodash.get'

import * as hooks from 'hooks'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { loggerTest } from 'logger/loggerTest'

import { EVENT_NAMES } from 'providers/EmitterProvider/constants'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

import { highlightDomElements } from './utils/highlightDomElements'
import { logger } from './logger/customLogger'

// Log tests and Startup Logs
loggerTest()

// TODO: Type configuration
type ActivatorProps = {
  configuration: any;
  retriggerEngine: () => void;
}

export const Activator = ({ configuration, retriggerEngine }: ActivatorProps) => {
  // React hooks
  const domElements = useContext(contexts.DomElementsContext)

  // This needs to filter for Unique Contracts
  const contractElements = domElements.filter((element) => element.feature === 'customContract')

  const getDomContractElements = () => {
    const filteredForContracts = domElements.filter((element) => element.feature !== 'customContract')
    return contractElements.length ? [ ...filteredForContracts, { id: contractElements[0].id, feature: 'customContract' } ] : filteredForContracts
  }

  const domElementsFilteredForContracts = getDomContractElements()

  const ethereum = useContext(contexts.EthereumContext)
  const { isEnabled } = ethereum

  // TODO: [DEV-248] We should make this an app level state later.
  const AppReady = true

  const { actions: { listenToEvent } } = useContext(EmitterContext)

  useEffect(() => {
    const dappHero = {
      debug: false,
      enabled: true,
      highlightEnabled: false,
      domElements,
      configuration,
      retriggerEngine,
      projectId: consts.global.apiKey,
      provider: ethereum,
      toggleHighlight(): void {
        dappHero.highlightEnabled = !dappHero.highlightEnabled
        highlightDomElements(dappHero.highlightEnabled, domElements)
      },
      listenToContractOutputChange: (cb): void => listenToEvent(EVENT_NAMES.contract.outputUpdated, cb),
    }

    const event = new CustomEvent('dappHeroConfigLoaded', { detail: dappHero })

    Object.assign(window, { dappHero })
    // Dispatch the event.
    window.dispatchEvent(event)
  }, [ AppReady ])

  if (!AppReady || !domElementsFilteredForContracts) return null

  return (
    <>
      {domElementsFilteredForContracts
          && domElementsFilteredForContracts.map((domElement) => (
            <FeatureReducer
              key={domElement.id}
              element={domElement.element}
              feature={domElement.feature}
              configuration={configuration}
              info={domElement}
              customContractElements={contractElements}
            />
          ))}
    </>
  )

}
