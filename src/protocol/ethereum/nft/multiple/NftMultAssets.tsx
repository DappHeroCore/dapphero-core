import React, { useState, FunctionComponent, useEffect } from 'react'
import * as hooks from 'hooks'
import * as api from '../../../../api'
import { NftSingleContainer } from '../single/NftSingleContainer'

interface NftMultAssetsProps {
  element: Element,
  invokeNode: Element,
  inputNode: Element,
  childContainer: Element,
}

export const NftMultAssets: FunctionComponent<NftMultAssetsProps> = ({ element, invokeNode, inputNode, childContainer }) => {
  const [ searchResults, setSearchResults ] = useState([])
  const { connected } = hooks.useDappHeroWeb3()

  useEffect(() => {
    const limit = element.id.match(/-limit_(\d+)/)?.[1]
    const owner = element.id.match(/-owner_([a-zA-Z0-9]+)/)?.[1]

    const eventHandler = async (event) => {
      if (event) { event.preventDefault() }
      Array.from(element.querySelectorAll('[id*=item-container]')).forEach((item) => item.remove())
      setSearchResults([])
      const { assets: searchResultsResponse } = await api.openSea.retrieveAssetsByOwner({
        owner,
        limit: limit ? Number.parseInt(limit) : undefined,
      })
      setSearchResults(searchResultsResponse)
    }

    const clickHandler = (event) => eventHandler(event)
    const enterKeyHandler = (event) => {
      if (event.key === 'Enter') {
        eventHandler(event)
      }
    }

    if (invokeNode) {
      invokeNode.addEventListener('click', clickHandler, false)
      inputNode.addEventListener('keypress', enterKeyHandler, false)
    } else { // execute search on load
      eventHandler(null)
    }

  }, [ connected ])

  // TODO: revisit original implementation, consider using replaceWith()
  // TODO: Progres State (fetcing, failed, success)
  return (
    searchResults.reverse().map((item) => {
      const copyNode = (childContainer.cloneNode(true) as HTMLElement)
      copyNode.style.display = copyNode.style.display === 'none' ? 'block' : copyNode.style.display
      element.appendChild(copyNode)
      return (
        <NftSingleContainer element={copyNode} responseObj={item} />
      )
    })
  )
}
