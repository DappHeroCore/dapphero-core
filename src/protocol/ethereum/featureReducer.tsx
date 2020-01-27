import React from 'react'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Reducer as CustomContractReducer } from './customContract/Reducer'

export const FeatureReducer = ({ element, configuration, index }) => {
  const featureType = element.id.split('-')[1]
  switch (featureType) {
  case 'network': {
    return (
      <NetworkReducer
        element={element}
        configuration={configuration}
        key={index}
      />
    )
  }

  case 'user': {
    return (
      <UserReducer
        element={element}
        configuration={configuration}
        key={index}
      />
    )
  }

  case 'customContract': {
    return (
      <CustomContractReducer
        element={element}
        configuration={configuration}
        // request={request}
        // element={element}
        // injected={injected}
        // element={request.element}
        // signifiers={signifiers}
        // mock={mock}
        key={index}
      />
    )
  }
  case 'threebox': {
    return <ThreeBoxReducer element={element} configuration={configuration} key={index} />
  }
  case 'nft': {
    return <NftReducer element={element} configuration={configuration} key={index} />
  }
  default:
    return null
  }
}
