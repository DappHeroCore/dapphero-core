import React, { FunctionComponent, useEffect, useState } from 'react'
import * as api from 'api'
import * as hooks from 'hooks'
import get from 'lodash/get'
import { NftSingleCustomField } from './NftSingleCustomField'

interface NftSingleContainerProps {
  element: HTMLElement,
  responseObj: {[key: string]: any}
}

export const NftSingleContainer = ({ element, responseObj }): any[] => {
  const contractMatch = element.id.match(/-contract_([a-zA-Z0-9]+)/)
  const contractAddress = contractMatch?.[1]
  const tokenMatch = element.id.match(/-tokenId_([a-zA-Z0-9]+)/)
  const tokenId = tokenMatch?.[1]
  const { networkName, connected } = hooks.useDappHeroWeb3()

  const [ children, setChildren ] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = responseObj ?? await api.openSea.retrieveAsset({ contractAddress, tokenId })
      const childComponentProps = Array.from(element.querySelectorAll('[id^=dh]'))
        .map((node) => {
          const match = node.id.match(/-customField_(.+)(-|$)/)
          const fieldData = get(response, match[1])
          return {
            childElement: node,
            fieldData,
          }
        })
      setChildren(childComponentProps)
    }
    if (connected) getData()
  }, [ connected, networkName ])

  // Do we collect all the tags under this container
  // like documetnSelectAll- when ID's are children of this element?
  // put them in to an array, and then map through them rendering a innerhtml swap?
  // keeping in mind some are images?
  return ( // TODO: Fix React Key situation
    children.map((item, index) => (<NftSingleCustomField key={index.toString() + Math.random().toString()} element={item.childElement} fieldData={item.fieldData} />))
  )
}

