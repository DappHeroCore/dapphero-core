import React, { useContext } from 'react'

// Reducers
import * as contexts from 'contexts'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Router as CustomContractRouter } from './customContract/Router'

// Types
import { FeatureReducerProps } from './types'

// Contexts

// Constants
const isProduction = process.env.NODE_ENV === 'production'

export const FeatureReducer = ({ feature, element, configuration, info, customContractElements }: FeatureReducerProps) => {
  const { chainId } = useContext(contexts.EthereumContext)
  const featureType = feature

  // A single contract thing comes in, now we need to SORT these by different contracts
  // and then have the case custom contract actually render the mapp of each.
  // sort customContractElements => Array of different Contracts.
  // case'customContract' maps through this array, and renders a router for each contract.

  const uniqueContractNames = new Set()
  customContractElements.map((element) => {
    uniqueContractNames.add(element.contract.contractName)
    return null
  })

  switch (featureType) {
    // case 'nft': {
    //   return <NftReducer element={element} info={info} />
    // }

    // case 'user': {
    //   return <UserReducer element={element} info={info} />
    // }

    // case 'network': {
    //   return <NetworkReducer element={element} info={info} />
    // }

    // case 'threebox': {
    //   return <ThreeBoxReducer element={element} info={info} />
    // }

    case 'customContract': {
      // FIXME: We're going to remove !isProduction conditional when Dappeteer library gets updated with chainId support
      for (const contractName of uniqueContractNames) {
        const methodsByContractAsElements = customContractElements.filter((element) => element.contract.contractName === contractName)
        // console.log("Contract Branches", methodsByContractAsElements)
        const contract = configuration.contracts.filter((contract) => (contract.contractName === contractName))[0]

        return <CustomContractRouter listOfContractMethods={methodsByContractAsElements} contract={contract} />
      }

      // if (
      //   !isProduction
      //   || (chainId && info?.contract.networkId && chainId === info.contract.networkId)
      // ) {
      //   return <CustomContractRouter element={customContractElements} configuration={configuration} info={info} />
      // }

      return null
    }

    default:
      return null
  }
}
