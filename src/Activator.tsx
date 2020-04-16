import React, { useContext, useEffect, useState } from 'react'
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
  const domElementsFilteredForContracts = domElements.filter((element) => element.feature !== 'customContract')

  // This needs to filter for Unique Contracts
  const domOnlyContract = domElements.filter((element) => element.feature === 'customContract')

  if (domOnlyContract.length > 0) {
    domElementsFilteredForContracts.push({
      id: domOnlyContract[0].id,
      feature: 'customContract',
    })
  }

  const ethereum = useContext(contexts.EthereumContext)
  const { isEnabled } = ethereum

  const AppReady = isEnabled // We should make this a state later

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

  if (AppReady) {
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
              customContractElements={domOnlyContract}
            />
          ))}
      </>
    )
  }

  return null
}
