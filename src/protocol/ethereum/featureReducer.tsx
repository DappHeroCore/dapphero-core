import React from 'react'
import { useWeb3React } from '@web3-react/core'

// Reducers
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Reducer as CustomContractReducer } from './customContract-/Reducer'

// Types
import { FeatureReducerProps } from './types'

// Constants
const isProduction = process.env.NODE_ENV === 'production'

export const FeatureReducer = ({ feature, element, configuration, info }: FeatureReducerProps) => {
  const injectedContext = useWeb3React()
  const featureType = feature

  if (info?.properties_?.methodId === '001') {
    console.log('TCL: FeatureReducer -> info', info)
    console.log('TCL: FeatureReducer -> featureType', featureType)
    console.log('TCL: FeatureReducer -> injectedContext', injectedContext)
  }

  switch (featureType) {
    case 'nft': {
      return <NftReducer element={element} configuration={configuration} info={info} />
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
      if (
        !isProduction
        || (injectedContext?.chainId && info?.contract.networkId && injectedContext.chainId === info.contract.networkId)
      ) {
        return <CustomContractReducer element={element} configuration={configuration} info={info} />
      }

      return null
    }

    default:
      return null
  }
}
