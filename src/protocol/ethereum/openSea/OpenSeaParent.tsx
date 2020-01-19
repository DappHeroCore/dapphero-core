import { logger } from 'logger/logger'
import React, { FunctionComponent } from 'react'
import { OpenSeaViewArgs } from './OpenSeaViewArgs'
import { OpenSeaViewArgsList } from './OpenSeaViewArgsList'
import { OpenSeaViewByInput } from './OpenSeaViewByInput'
import { OpenSeaAssetPage } from './OpenSeaAssetPage'
import { EthContractProps } from '../../../types/types'
import { OpenSeaFunctions, OpenSeaRequestString } from './types'

type OpenSeaParentProps = Pick<EthContractProps, Exclude<keyof EthContractProps, 'method' | 'instance'>>

const OPENSEA_SUPPORTED_NETWORKS = [ 'Main', 'Rinkeby' ]

export const OpenSeaParent: FunctionComponent<OpenSeaParentProps> = ({
  injected,
  signifiers,
  request: { requestString },
  element,
}) => {
  if (!OPENSEA_SUPPORTED_NETWORKS.includes(injected.networkName)) return null

  const func = requestString[OpenSeaRequestString.FUNCTION]
  console.log('func', func)

  switch (func) {
  case OpenSeaFunctions.RETRIEVE_ASSET: {
    return (
      <OpenSeaViewArgs
        requestString={requestString}
        networkName={injected.networkName}
        provider={injected.lib._provider}
        injected={injected}
        func={func}
        signifiers={signifiers}
        element={element}
      />
    )
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_OWNER:
  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_CONTRACT:
  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_SEARCH: {
    return (
      <OpenSeaViewArgsList
        requestString={requestString}
        networkName={injected.networkName}
        provider={injected.lib._provider}
        injected={injected}
        func={func}
        signifiers={signifiers}
        element={element}
      />
    )
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_SEARCH_INPUT: {
    return (
      <OpenSeaViewByInput
        requestString={requestString}
        networkName={injected.networkName}
        provider={injected.lib._provider}
        injected={injected}
        func={func}
        signifiers={signifiers}
        element={element}
      />
    )
  }

  case OpenSeaFunctions.ASSET_PAGE: {
    return (
      <OpenSeaAssetPage
        requestString={requestString}
        networkName={injected.networkName}
        provider={injected.lib._provider}
        injected={injected}
        func={func}
        signifiers={signifiers}
        element={element}
      />
    )
  }

  default: {
    return null
  }
  }
}
