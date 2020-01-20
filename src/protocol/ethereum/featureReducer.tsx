import React from 'react'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'

export const featureReducer = (request, element) => {

  switch (request.feature) {
  case 'network': {
    return (
      <NetworkReducer
        element={element}
      />
    )
  }

  case 'user': {
    return (
      <UserReducer
        element={element}
      />
    )
  }
  // case 'customContract': {
  //   return (
  //     <EthContractParent

  //       request={request}
  //       element={element}
  //       injected={injected}
  //       element={request.element}
  //       signifiers={signifiers}
  //       mock={mock}
  //     />
  //   )
  // }
  case 'threebox': {
    return <ThreeBoxReducer element={element} />
  }
  case 'nft': {
    return <NftReducer element={element} />
  }
  default:
    return null
  }
}
