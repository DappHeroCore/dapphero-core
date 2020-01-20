import React, { FunctionComponent } from 'react'
import { NftSingleContainer } from './NftSingleContainer'
import { NftSingleCustomField } from './NftSingleCustomField'

interface ReducerProps {
  element: HTMLElement
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element }) => {
  const isContainer = element.id.split('-')[4] === 'container'
  console.log("Is container matching? ", isContainer)
  if (isContainer) {
    return (<NftSingleContainer element={element} />)
  }
}
