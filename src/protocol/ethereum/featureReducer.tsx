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

// Constants
const FEATURES_COMPONENTS = {
  nft: NftReducer,
  user: UserReducer,
  network: NetworkReducer,
  threebox: ThreeBoxReducer,
  customContract: CustomContractReducer,
}

export const FeatureReducer = ({ feature, element, configuration, key = '', index, info }: FeatureReducerProps) => {
  /* TODO: Remove element.id.split when all features are integrated */
  const featureType = feature || element.id.split('-')[1]

  // Get Component Reducer from available features
  const FeatureComponent = FEATURES_COMPONENTS[featureType]

  if (!FeatureComponent) return null

  /* FIXME: We shouldn't use index as keys. Remove it when all features are integrated */
  return <FeatureComponent key={key || index} element={element} configuration={configuration} info={info} />

  /* TODO: Remove this comment later on */
  // case 'customContract': {
  //   return (
  //     <CustomContractReducer
  //       element={element}
  //       configuration={configuration}
  //       // request={request}
  //       // element={element}
  //       // injected={injected}
  //       // element={request.element}
  //       // signifiers={signifiers}
  //       // mock={mock}
  //       key={index}
  //     />
  //   )
  // }
}
