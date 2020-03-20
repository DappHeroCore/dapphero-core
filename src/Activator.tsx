import React, { useContext, useEffect } from 'react'

import * as hooks from 'hooks'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { loggerTest } from 'logger/loggerTest'

import { EVENT_NAMES } from 'providers/EmitterProvider/constants'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { FeatureReducer } from './protocol/ethereum/featureReducer'

// Log tests and Startup Logs
loggerTest()

// TODO: Type configuration
type ActivatorProps = {
  configuration: any;
  highlightDomElements: (shouldHighlight: boolean) => void;
}

export const Activator = ({ configuration, highlightDomElements }: ActivatorProps) => {
  const domElements = useContext(contexts.DomElementsContext)
  const { actions: { listenToEvent } } = useContext(EmitterContext)

  const attemptedEagerConnect = hooks.useEagerConnect()

  useEffect(() => {
    const dappHero = {
      debug: false,
      enabled: true,
      highlightEnabled: false,
      domElements,
      configuration,
      projectId: consts.global.apiKey,
      toggleHighlight(): void {
        dappHero.highlightEnabled = !dappHero.highlightEnabled
        highlightDomElements(dappHero.highlightEnabled)
      },
      listenToContractOutputChange: (cb): void => listenToEvent(EVENT_NAMES.contract.outputUpdated, cb),
    }

    Object.assign(window, { dappHero })
  }, [])

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
