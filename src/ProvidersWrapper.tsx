import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'

import get from 'lodash.get'
import { CookiesProvider } from 'react-cookie'
import { Web3ReactProvider } from '@web3-react/core'
import { getDomElements } from '@dapphero/dapphero-dom'

import * as api from 'api'
import { ethers } from 'ethers'
import * as consts from 'consts'
import { DomElementsContext } from 'contexts'

import { Activator } from './Activator'
import { logger } from './logger/customLogger'

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

export const ProvidersWrapper: React.FC = () => {
  // react hooks
  const [ configuration, setConfig ] = useState(null)
  const [ domElements, setDomElements ] = useState(null)

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

  // handlers
  const highlightDomElements = (shouldHighlight: boolean): void => {
    if (!domElements) return

    const styleDappHeroElement = (element: HTMLElement): void => {
      Object.assign(element.style, { border: shouldHighlight ? `2px solid red` : `none` })
    }

    domElements.forEach((domElement) => {
      const element: HTMLElement = get(domElement, 'element')

      const childrenElements: HTMLElement[] = get(domElement, 'childrenElements', [])
        .map((childrenElement: { element: HTMLElement & { element: HTMLElement; id: string }[] }) => {
          if (Array.isArray(childrenElement.element)) {
            return childrenElement.element.map((subElements) => subElements.element)
          }

          return childrenElement.element
        })
        .flat()

      if (element) {
        styleDappHeroElement(element)
      }

      if (childrenElements.length) {
        childrenElements.forEach(styleDappHeroElement)
      }
    })
  }

  if (domElements != null) {
    return (
      <CookiesProvider>
        <ToastProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <DomElementsContext.Provider value={domElements}>
              <Activator configuration={configuration} highlightDomElements={highlightDomElements} />
            </DomElementsContext.Provider>
          </Web3ReactProvider>
        </ToastProvider>
      </CookiesProvider>
    )
  }
  return null
}
