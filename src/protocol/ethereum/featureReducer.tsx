import React, { useEffect, useState } from 'react'

// Reducers
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Manager } from './customContract/Manager'

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
      return (
        <Manager customContractElements={customContractElements} configuration={configuration} />
      )
    }

    default:
      return null
  }
}
