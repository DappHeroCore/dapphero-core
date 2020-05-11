import { useEffect } from 'react'
import get from 'lodash.get'
import { ELEMENT_TYPES, TAG_TYPES, DATA_PROPERTY } from '@dapphero/dapphero-dom'

// function displayTokenIdsOnAnchorLinks(element, tokenId): void {
//   const anchors = Array.from(element.querySelectorAll('a'))
//   anchors.forEach((anchor: Element) => {
//     const href = anchor.getAttribute('href')
//     if (href.includes('$THIS_TokenID')) {
//       anchor.setAttribute('href', href.replace('$THIS_TokenID', tokenId))
//     }
//   })
// }

// function displayTokenIdsOnSpanText(element, tokenId): void {
//   const spanTokenIdsPaths = document.evaluate(
//     "//span[contains(., '$THIS_TokenID')]",
//     element,
//     null,
//     XPathResult.ANY_TYPE,
//     null,
//   )
//   const spanTokenIdsElement = spanTokenIdsPaths.iterateNext()

//   if (!spanTokenIdsElement) return
//   Object.assign(spanTokenIdsElement, { textContent: tokenId })
// }

// function displayTokenIdsOnIframe(element, tokenId): void {
//   const iframeTokenIdsPaths = document.evaluate(
//     "//iframe[contains(@src, '$THIS_TokenID')]",
//     element,
//     null,
//     XPathResult.ANY_TYPE,
//     null,
//   )
//   const iframeTokenIdsElement = iframeTokenIdsPaths.iterateNext()

//   if (!iframeTokenIdsElement) return

//   // TODO: [DEV-255] Does 'getAttribute' exist on type node? In NFT reducer
//   const iframeSrc = (iframeTokenIdsElement as any).getAttribute('src')
//   const updatedSrc = iframeSrc.replace('$THIS_TokenID', tokenId);
//   (iframeTokenIdsElement as any).setAttribute('src', updatedSrc)
// }

function displayValueOnAnchorLinks(element, key, value): void {
  const anchors = Array.from(element.querySelectorAll('a'))
  anchors.forEach((anchor: Element) => {
    const href = anchor.getAttribute('href')
    if (href.includes(key)) {
      anchor.setAttribute('href', href.replace(key, value))
    }
  })
}

function displayKeyValueOnSpanText(element, key, value): void {
  const spanTokenIdsPaths = document.evaluate(
    `//span[contains(., '${key}')]`,
    element,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const spanTokenIdsElement = spanTokenIdsPaths.iterateNext()

  if (!spanTokenIdsElement) return
  Object.assign(spanTokenIdsElement, { textContent: value })
}
function displayKeyValueOnIframe(element, key, value): void {
  const iframeKeyValuePaths = document.evaluate(
    `//iframe[contains(@src, '${key}')]`,
    element,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const iframeKeyValueElement = iframeKeyValuePaths.iterateNext()

  if (!iframeKeyValueElement) return

  // TODO: [DEV-255] Does 'getAttribute' exist on type node? In NFT reducer
  const iframeSrc = (iframeKeyValueElement as any).getAttribute('src')
  const updatedSrc = iframeSrc.replace(key, value);
  (iframeKeyValueElement as any).setAttribute('src', updatedSrc)
}

export const useRenderNfts = ({ nfts, item, element, getAssetElements }) => {

  useEffect(() => {
    if (!nfts) return

    nfts.forEach((nft, index) => {
      console.log('useRenderNfts -> nft', nft)
      item.childrens.forEach((childrenItem) => {
        const { element: childNode, jsonPath } = childrenItem

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

      const clonedItem = item.root.cloneNode(true)

      // Replace $THIS_TokenID/ContractAddress/OwnerAddress on Anchor links, Spans or Iframes.

      // displayTokenIdsOnAnchorLinks(clonedItem, nft?.token_id)
      displayValueOnAnchorLinks(clonedItem, '$THIS_TokenID', nft?.token_id)
      displayValueOnAnchorLinks(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      displayValueOnAnchorLinks(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // displayTokenIdsOnSpanText(clonedItem, nft?.token_id)
      displayKeyValueOnSpanText(clonedItem, '$THIS_TokenID', nft?.token_id)
      displayKeyValueOnSpanText(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      displayKeyValueOnSpanText(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // displayTokenIdsOnIframe(clonedItem, nft?.token_id)
      displayKeyValueOnIframe(clonedItem, '$THIS_TokenID', nft?.token_id)
      displayKeyValueOnIframe(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      displayKeyValueOnIframe(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

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

}
