import React, { FunctionComponent } from 'react'
import { NftMultSearch } from './NftMultSearch'

interface ReducerProps {
  element: HTMLElement
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element }) => {
  const actionType = element.id.split('-')[3]

  switch (actionType) {
  case 'search': {
    const type = element.id.split('-')[4]
    if (type !== 'parentContainer') {
      return null
    }
    const childContainer = element.querySelector('[id*=item-container]')
    const uniqueIdentifier = element.id.match(/-id_([a-zA-Z0-9]+)/)?.[1] ?? null
    if (uniqueIdentifier == null) throw new Error('You did not provide a unique Identfiier on the mult nft id')

    const siblingNodes = Array.from(document.querySelectorAll(`[id*=${uniqueIdentifier}`))
    const inputNode = siblingNodes.filter((item) => item.id.split('-')[4] === 'input')[0]
    const invokeNode = siblingNodes.filter((item) => item.id.split('-')[4] === 'invoke')[0]
    return (
      <NftMultSearch element={element} invokeNode={invokeNode} inputNode={inputNode} childContainer={childContainer} />
    )}
  
  case 'owner': {
    return (
      null  
    )
  }
  case 'contract': {
    return (
      null
    )
  }
  default:
    return null
  }
}

// TODO: A good idea?
// const getChildContainer = (element, id) => element.querySelector(id)
// const getUniqueIdnetifies = (element) => element.id.match(/-id_([a-zA-Z0-9]+)/)?.[1] ?? null
// const getSiblingNodes = (uniqueIdentifier) => Array.from(document.querySelectorAll(`[id*=${uniqueIdentifier}`))
// const getInputNode = (siblingNodes) => siblingNodes.filter((item) => item.id.split('-')[4] === 'input')[0]
// const getInvokeNode = (siblingNodes) => siblingNodes.filter((item) => item.id.split('-')[4] === 'invoke')[0]
