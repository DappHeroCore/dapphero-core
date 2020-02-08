import React from 'react'
import * as hooks from 'hooks'

// Reducers
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Reducer as CustomContractReducer } from './customContract-/Reducer'

// Types
import { FeatureReducerProps } from './types'

export const FeatureReducer = ({ feature, element, configuration, info }: FeatureReducerProps) => {
  const injectedContext = hooks.useDappHeroWeb3()
  const featureType = feature

  switch (featureType) {
    case 'nft':
      return <NftReducer element={element} configuration={configuration} info={info} />
    case 'user':
      return <UserReducer element={element} info={info} />
    case 'network':
      return <NetworkReducer element={element} info={info} />
    case 'threebox':
      return <ThreeBoxReducer element={element} info={info} />
    case 'customContract': {
      if (
        injectedContext?.networkId
        && info?.contract.networkId
        && injectedContext.networkId === info.contract.networkId
      ) {
        return <CustomContractReducer element={element} configuration={configuration} info={info} />
      }
      return null
    }
    default:
      return null

  }

}
