import React, { useContext, useEffect } from 'react'
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
  const ethereum = useContext(contexts.EthereumContext)

  const { actions: { listenToEvent } } = useContext(EmitterContext)

  // Custom hooks
  const attemptedEagerConnect = hooks.useEagerConnect()
  const web3React = useWeb3React()

  useEffect(() => {
    const dappHero = {
      debug: false,
      enabled: true,
      highlightEnabled: false,
      domElements,
      configuration,
      retriggerEngine,
      projectId: consts.global.apiKey,
      provider: get(web3React, 'library.provider', null),
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
  }, [ web3React, web3React.library ])

  if (attemptedEagerConnect) {
    return (
      <>
        {domElements
          && domElements.map((domElement) => (
            <FeatureReducer
              key={domElement.id}
              element={domElement.element}
              feature={domElement.feature}
              configuration={configuration}
              info={domElement}
            />
          ))}
      </>
    )
  }

  return null
}
