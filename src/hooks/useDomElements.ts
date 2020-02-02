import React, { useContext } from 'react'
import * as contexts from 'contexts'

export const useDomElements = () => {
  const DomElements = useContext(contexts.DomElementsContext)
  return DomElements
}
