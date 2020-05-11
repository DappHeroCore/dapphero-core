import React, { useState, useEffect, useContext } from 'react'
import { useToasts } from 'react-toast-notifications'
import * as contexts from 'contexts'
import { DATA_PROPERTY } from '@dapphero/dapphero-dom'

import * as utils from 'utils'
import { useGetTokensForContractAddress } from './useGetTokensForContractAddress'
import { useGetTokensFromOwner } from './useGetTokensFromOwner'
import { useRenderNfts } from './useRenderNfts'

export const Reducer = ({ info, element }) => {
  // Get NFTs properties
  const { nft, properties_ } = info
  const { item, tokens = [], pagination } = nft
  const { limit, offset: defaultOffset } = pagination

  // React hooks
  const [ offset, setOffset ] = useState(defaultOffset)

  // Custom hooks
  const { addToast } = useToasts()

  const { address: userAddress } = useContext(contexts.EthereumContext)

  const errorToast = ({ message }): void => addToast(message, { appearance: 'error' })

  // Convert $URL to their respective value from query params
  const parsedProperties = { ...properties_ }

  for (const key in properties_) {
    const value = properties_[key]
    const parsedValue = utils.getQueryParameterValue(value, key, userAddress)

    Object.assign(parsedProperties, { [key]: parsedValue })
  }

  const parsedTokens = tokens.map((token: string) => utils.getQueryParameterValue(token, 'assetTokenId'))

  const currentUser = utils.getQueryParameterValue(utils.CURRENT_USER, utils.CURRENT_USER, userAddress)

  if (currentUser) {
    Object.assign(parsedProperties, { assetOwnerAddress: currentUser })
  }

  // Constants
  const tagId = parsedProperties?.tagId
  const assetOwnerAddress = parsedProperties?.assetOwnerAddress
  const assetContractAddress = parsedProperties?.assetContractAddress

  // Token flags
  const { length: totalTokens } = parsedTokens
  const isAllTokens = totalTokens === 0
  const isSingleToken = totalTokens === 1
  const isMultipleTokens = totalTokens > 1

  // Helpers
  const getAssetElements = (): NodeListOf<Element> => document.querySelectorAll(`[data-dh-property-asset-item][${DATA_PROPERTY}-tag-id="${tagId}"]`)

  const removeAssetElements = (): void => {
    const assetsElements = getAssetElements()
    assetsElements.forEach((assetElement) => assetElement.remove())
  }

  const displayErrorMessage = ({ simpleErrorMessage, completeErrorMessage, error }) => {
    errorToast({ message: simpleErrorMessage })
    console.log('-----')
    console.log(completeErrorMessage)
    console.log(error)
    console.log('-----')
  }

  // Handlers
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
  const tokensFromOwnerAddress = useGetTokensFromOwner({
    isSingleToken,
    isMultipleTokens,
    isAllTokens,
    parsedTokens,
    assetContractAddress,
    assetOwnerAddress,
    limit,
    offset,
    tokens,
  })

  // Get tokens by contract address
  const tokensFromContractAddress = useGetTokensForContractAddress({
    isSingleToken,
    isMultipleTokens,
    isAllTokens,
    parsedTokens,
    assetContractAddress,
    assetOwnerAddress,
    limit,
    offset,
    tokens,
  })

  // Display any errors from retriving tokens
  useEffect(() => {
    if (tokensFromContractAddress.error) displayErrorMessage(tokensFromContractAddress.error)
    if (tokensFromOwnerAddress.error) displayErrorMessage(tokensFromOwnerAddress.error)

  }, [ tokensFromContractAddress.error, tokensFromOwnerAddress.error ])

  // Render NFTs
  useRenderNfts({ nfts: (tokensFromOwnerAddress.nfts || tokensFromContractAddress.nfts), item, element, getAssetElements })
  // Attach NFTS to window object
  useEffect(() => {
    if (window.dappHero) {
      const key = info.properties_.tagId
      const value = tokensFromOwnerAddress.nfts || tokensFromContractAddress.nfts || null
      const tagId = { [key]: value }

      Object.assign(window.dappHero.collectibles, { tagId })
    }
  }, [ tokensFromContractAddress, tokensFromOwnerAddress ])

  // Add event listeners to prev and next buttons
  useEffect(() => {
    const { elements } = pagination
    const prevButton = elements.find((el: HTMLElement) => el.hasAttribute(`${DATA_PROPERTY}-pagination-prev`))
    const nextButton = elements.find((el: HTMLElement) => el.hasAttribute(`${DATA_PROPERTY}-pagination-next`))

    if (prevButton) prevButton.addEventListener('click', handlePrevButton)
    if (nextButton) nextButton.addEventListener('click', handleNextButton)
  }, [])

  // Replace iframe elements having $THIS_ContractAddress as a text content to their respective contract address
  useEffect(() => {
    if (!info) return

    const iframeContractAddressPaths = document.evaluate(
      "//iframe[contains(@src, '$THIS_ContractAddress')]",
      info.element,
      null,
      XPathResult.ANY_TYPE,
      null,
    )
    const iframeContractAddressElement = iframeContractAddressPaths.iterateNext()

    if (!iframeContractAddressElement) return

    const iframeSrc = (iframeContractAddressElement as any).getAttribute('src')
    const updatedSrc = iframeSrc.replace('$THIS_ContractAddress', assetOwnerAddress);
    (iframeContractAddressElement as any).setAttribute('src', updatedSrc)
  }, [ info ])

  return null
}
