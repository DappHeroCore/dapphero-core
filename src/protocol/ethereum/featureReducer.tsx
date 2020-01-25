import React from 'react'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
// import { Reducer as NftReducer } from './nft/Reducer'
import { Reducer as CustomContractReducer } from './customContract/Reducer'

export const featureReducer = (request, element, index) => {

  switch (request.feature) {
  case 'network': {
    return (
      <NetworkReducer
        element={element}
        key={index}
      />
    )
  }

  case 'user': {
    return (
      <UserReducer
        element={element}
        key={index}
      />
    )
  }
  case 'customContract': {
    return (
      <CustomContractReducer
        element={element}
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
    return <ThreeBoxReducer element={element} key={index} />
  }
  // case 'nft': {
  //   return <NftReducer element={element} key={index} />
  // }
  default:
    return null
  }
}
