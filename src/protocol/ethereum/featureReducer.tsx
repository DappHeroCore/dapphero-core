import React from 'react'

// Reducers
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Reducer as CustomContractReducer } from './customContract-/Reducer'
// import { Reducer as CustomContractReducer } from './customContract/Reducer'

// Types
import { FeatureReducerProps } from './types'

export const FeatureReducer = ({ feature, element, configuration, info }: FeatureReducerProps) => {

  /* TODO: Remove element.id.split when all features are integrated */
  const featureType = feature // || element.id.split('-')[1]

  // Get Component Reducer from available features
  // const FeatureComponent = FEATURES_COMPONENTS[featureType]

  // if (!FeatureComponent) return null

  // /* FIXME: We shouldn't use index as keys. Remove it when all features are integrated */
  // return <FeatureComponent element={element} configuration={configuration} info={info} />

  switch (featureType) {
  case 'nft':
    return <NftReducer element={element} configuration={configuration} info={info} />
  case 'user':
    return <UserReducer element={element} info={info} />
  case 'network':
    return <NetworkReducer element={element} info={info} />
  case 'threebox':
    return <ThreeBoxReducer element={element} info={info} />
  case 'customContract':
    return <CustomContractReducer element={element} configuration={configuration} info={info} />
  default:
    return null

  }

}
