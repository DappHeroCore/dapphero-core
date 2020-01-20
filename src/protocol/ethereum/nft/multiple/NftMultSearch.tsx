import React, { useState, FunctionComponent, useEffect } from 'react'
import * as api from '../../../../api'
import { NftSingleContainer } from '../single/NftSingleContainer'

interface NftMultSearchProps {
  element: Element,
  invokeNode: Element,
  inputNode: Element,
  childContainer: Element,
}

export const NftMultSearch: FunctionComponent<NftMultSearchProps> = ({ element, invokeNode, inputNode, childContainer }) => {
  const [ searchResults, setSearchResults ] = useState([])

  useEffect(() => {
    const limit = element.id.match(/-limit_(\d+)/)?.[1]

    const eventHandler = async (event) => {
      if (event) { event.preventDefault() }
      Array.from(element.children).forEach((item) => item.remove())
      setSearchResults([])
      const { assets: searchResultsResponse } = await api.openSea.retrieveAssetsBySearch({
        search: inputNode.value,
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

    invokeNode.addEventListener('click', clickHandler, false)
    inputNode.addEventListener('keypress', enterKeyHandler, false)

  }, [])

  //   console.log('childContainer', childContainer)
  // TODO: Progres State (fetcing, failed, success)
  return (
    searchResults.reverse().map((item, index) => {
      const copyNode = (childContainer.cloneNode(true) as HTMLElement)
      copyNode.style.display = copyNode.style.display === 'none' ? 'block' : copyNode.style.display
      element.appendChild(copyNode)
      if (index === searchResults.length - 1) {
        childContainer.remove()
      }
      return (
        <NftSingleContainer element={copyNode} responseObj={item} />
      )
    })
  )
}
