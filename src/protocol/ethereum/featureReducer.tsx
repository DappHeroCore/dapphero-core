import React, { useEffect } from 'react'

// Reducers
import { useThrottledFn } from 'beautiful-react-hooks'
import { Reducer as NetworkReducer } from './network/Reducer'
import { Reducer as UserReducer } from './user/Reducer'
import { Reducer as ThreeBoxReducer } from './threeBox/Reducer'
import { Reducer as NftReducer } from './nft/Reducer'
import { Manager } from './customContract/Manager'
import { Reducer as Modal } from './payments/Reducer'

// Types
import { FeatureReducerProps } from './types'

export const FeatureReducer: React.FunctionComponent<FeatureReducerProps> = ({
  feature,
  element,
  configuration,
  info,
  domElements,
  customContractElements,
  retriggerEngine,
  paymentAddress,
}: FeatureReducerProps) => {

  // // Select the node that will be observed for mutations
  // const targetNode = document.getElementById('thisContainer')

  // // Options for the observer (which mutations to observe)
  // const config = { attributes: true, childList: true, subtree: true }

  // // Callback function to execute when mutations are observed
  // const throttledCallBack = useThrottledFn((mutationsList, observer) => {
  //   // Use traditional 'for loops' for IE 11
  //   for (const mutation of mutationsList) {
  //     if (mutation.type === 'childList') {

  //       // When a node has been added or removed, we need to add or remove the custom contract event listeners.
  //       console.log('A child node has been added or removed.')
  //     } else if (mutation.type === 'attributes') {
  //       console.log('The ' + mutation.attributeName + ' attribute was modified.')
  //     }
  //   }

  // }, 250)

  // // Create an observer instance linked to the callback function
  // const observer = new MutationObserver(throttledCallBack)

  // // Start observing the target node for configured mutations
  // observer.observe(targetNode, config)

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
      return <NetworkReducer element={element} info={info} domElements={domElements} />
    }

    case 'threebox': {
      return <ThreeBoxReducer element={element} info={info} />
    }

    case 'payments': {
      return <Modal element={element} paymentAddress={paymentAddress} info={info} />
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
