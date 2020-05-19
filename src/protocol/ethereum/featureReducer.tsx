import React, { useEffect, useState } from 'react'

// Reducers
import { getDomElements } from '@dapphero/dapphero-dom'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Router as CustomContractRouter } from './customContract/Router'

// Types
import { FeatureReducerProps } from './types'

export const FeatureReducer: React.FunctionComponent<FeatureReducerProps> = ({
  feature,
  element,
  configuration,
  info,
  customContractElements,
  retriggerEngine,
  timeStamp,
}: FeatureReducerProps) => {

  const featureType = feature

  // A single contract thing comes in, now we need to SORT these by different contracts
  // and then have the case custom contract actually render the mapp of each.
  // sort customContractElements => Array of different Contracts.
  // case'customContract' maps through this array, and renders a router for each contract.

  const uniqueContractNames = new Set([ ...customContractElements.map(({ contract }) => contract.contractName) ])

  switch (featureType) {
    case 'nft': {
      return <NftReducer element={element} info={info} retriggerEngine={retriggerEngine} />
    }

    case 'user': {
      return <UserReducer element={element} info={info} />
    }

    case 'network': {
      return <NetworkReducer element={element} info={info} />
    }

    case 'threebox': {
      return <ThreeBoxReducer element={element} info={info} />
    }

    case 'customContract': {
      // FIXME: We're going to remove !isProduction conditional when Dappeteer library gets updated with chainId support
      for (const contractName of uniqueContractNames) {

        const domElements2 = getDomElements(configuration)
        const contractElements = domElements2.filter((element) => element.feature === 'customContract')
        console.log('contractElements', contractElements)
        console.log('contractName', contractName)
        console.log('Custom Contract Elements: ', customContractElements)
        const methodsByContractAsElements = contractElements.filter((element) => element.contract.contractName === contractName)
        const contract = configuration.contracts.filter((thisContract) => (thisContract.contractName === contractName))[0]
        return (
          <CustomContractRouter
            listOfContractMethods={methodsByContractAsElements}
            contract={contract}
            timeStamp={timeStamp}
            retriggerEngine={retriggerEngine}
          />
        )
      }

      return null
    }

    default:
      return null
  }
}
