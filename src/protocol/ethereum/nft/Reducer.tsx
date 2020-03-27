import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import get from 'lodash.get'
import { useWeb3React } from '@web3-react/core'
import { ELEMENT_TYPES, TAG_TYPES, DATA_PROPERTY } from '@dapphero/dapphero-dom'

// Utils
import * as utils from 'utils'

// Api
import { openSeaApi } from './api'

export const Reducer = ({ info, element }) => {
  // Get NFTs properties
  const { nft, properties_ } = info
  const { item, tokens = [], pagination } = nft
  const { limit, offset: defaultOffset } = pagination

  // React hooks
  const [ nfts, setNfts ] = useState(null)
  const [ offset, setOffset ] = useState(defaultOffset)

  // Custom hooks
  const { addToast } = useToasts()
  const injectedContext = useWeb3React()

  const userAddress = injectedContext?.account
  const errorToast = ({ message }): void => addToast(message, { appearance: 'error' })

  // Convert $URL to their respective value from query params
  const parsedProperties = { ...properties_ }

  for (const key in properties_) {
    const value = properties_[key]
    const parsedValue = utils.getQueryParameterValue(value, key, userAddress)

    Object.assign(parsedProperties, { [key]: parsedValue })
  }

  const parsedTokens = tokens.map((token: string) => utils.getQueryParameterValue(token, 'assetTokenId'))

  // Constants
  const tagId = parsedProperties?.tagId
  const assetOwnerAddress = parsedProperties?.assetOwnerAddress
  const assetContractAddress = parsedProperties?.assetContractAddress

  // Token flags
  const { length: totalTokens } = parsedTokens
  const isAllTokens = totalTokens === 0
  const isSingleToken = totalTokens === 1
  const isMultipleTokens = totalTokens > 1

  // Handlers
  const getAssetElements = (): NodeListOf<Element> => document.querySelectorAll(`[data-dh-property-asset-item][${DATA_PROPERTY}-tag-id="${tagId}"]`)

  const removeAssetElements = (): void => {
    const assetsElements = getAssetElements()
    assetsElements.forEach((assetElement) => assetElement.remove())
  }

  const handlePrevButton = (): void => {
    if (offset < 1) return

    removeAssetElements()
    setOffset((prevOffset) => prevOffset - 1)
  }

  const handleNextButton = (): void => {
    removeAssetElements()
    setOffset((prevOffset) => prevOffset + 1)
  }

  // Get tokens from owner address
  useEffect(() => {
    if (!assetOwnerAddress) return

    if (isSingleToken) {
      const [ token ] = parsedTokens
      const errorMessage = `We couldn't get token ${token} from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getSingleAsset({ assetOwnerAddress, assetContractAddress, token })
        .then(setNfts)
        .catch(() => errorToast({ message: errorMessage }))
    }

    if (isMultipleTokens) {
      const errorMessage = `We couldn't get tokens ${tokens.join(', ')} from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getMultipleAssets({ assetOwnerAddress, assetContractAddress, tokens, limit, tokens })
        .then(setNfts)
        .catch(() => errorToast({ message: errorMessage }))
    }

    if (isAllTokens) {
      const errorMessage = `We couldn't get all tokens from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getAllAssets({ assetOwnerAddress, assetContractAddress, limit, offset })
        .then(setNfts)
        .catch(() => errorToast({ message: errorMessage }))
    }
  }, [ assetOwnerAddress, offset ])

  // Get tokens for contract address
  useEffect(() => {
    if (!assetContractAddress) return

    if (isSingleToken) {
      const [ token ] = parsedTokens
      const errorMessage = `We couldn't get token ${token} from contract address ${assetContractAddress}`

      openSeaApi.contract
        .getSingleAsset({ assetContractAddress, token })
        .then(setNfts)
        .catch(() => errorToast({ message: errorMessage }))
    }

    if (isMultipleTokens) {
      const errorMessage = `We couldn't get tokens ${tokens.join(', ')} from contract address ${assetContractAddress}`

      openSeaApi.contract
        .getMultipleAssets({ assetContractAddress, tokens, limit, offset })
        .then(setNfts)
        .catch(() => errorToast({ message: errorMessage }))
    }

    if (isAllTokens) {
      const errorMessage = `We couldn't get all tokens from contract address ${assetContractAddress}`

      openSeaApi.contract
        .getAllAssets({ assetContractAddress, limit, offset })
        .then(setNfts)
        .catch(() => errorToast({ message: errorMessage }))
    }
  }, [ assetContractAddress, offset ])

  // Render NFTs
  useEffect(() => {
    if (!nfts) return

    nfts.forEach((nft, index) => {
      const clonedItem = item.root.cloneNode(true)

      Array.from(clonedItem.children).forEach((childNode: HTMLElement & HTMLImageElement) => {
        const jsonPath = childNode.getAttribute(`${DATA_PROPERTY}-asset-json-path`)
        if (!jsonPath) return

        const tagType = TAG_TYPES[childNode.tagName] || TAG_TYPES.DEFAULT

        const value = get(nft, jsonPath, '')
        if (!value) return

        if (tagType === ELEMENT_TYPES.text) {
          Object.assign(childNode, { textContent: value })
        }

        if (tagType === ELEMENT_TYPES.image) {
          Object.assign(childNode, { src: value })
        }
      })

      // Replace root with first cloned item
      if (index === 0) {
        const assetElements = getAssetElements()

        if (assetElements.length) {
          item.root.replaceWith(clonedItem)
        } else {
          element.insertAdjacentElement('beforeend', clonedItem)
        }
      }

      // Get last cloned item appended and insert a new cloned item after that
      if (index) {
        const beforeElement = element.querySelector(`[${DATA_PROPERTY}-asset-item]:last-child`)
        if (beforeElement) (beforeElement as HTMLElement).insertAdjacentElement('afterend', clonedItem)
      }
    })
  }, [ nfts ])

  // Add event listeners to prev and next buttons
  useEffect(() => {
    const { elements } = pagination
    const prevButton = elements.find((el: HTMLElement) => el.hasAttribute(`${DATA_PROPERTY}-pagination-prev`))
    const nextButton = elements.find((el: HTMLElement) => el.hasAttribute(`${DATA_PROPERTY}-pagination-next`))

    if (prevButton) prevButton.addEventListener('click', handlePrevButton)
    if (nextButton) nextButton.addEventListener('click', handleNextButton)
  }, [])

  return null
}
