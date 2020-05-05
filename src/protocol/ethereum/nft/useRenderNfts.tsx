import { useEffect } from 'react'
import get from 'lodash.get'
import { ELEMENT_TYPES, TAG_TYPES, DATA_PROPERTY } from '@dapphero/dapphero-dom'

function displayTokenIdsOnAnchorLinks(element, tokenId): void {
  const anchors = Array.from(element.querySelectorAll('a'))
  anchors.forEach((anchor: Element) => {
    const href = anchor.getAttribute('href')
    if (href.includes('$THIS_TokenID')) {
      anchor.setAttribute('href', href.replace('$THIS_TokenID', tokenId))
    }
  })
}

function displayTokenIdsOnSpanText(element, tokenId): void {
  const spanTokenIdsPaths = document.evaluate(
    "//span[contains(., '$THIS_TokenID')]",
    element,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const spanTokenIdsElement = spanTokenIdsPaths.iterateNext()

  if (!spanTokenIdsElement) return
  Object.assign(spanTokenIdsElement, { textContent: tokenId })
}

function displayTokenIdsOnIframe(element, tokenId): void {
  const iframeTokenIdsPaths = document.evaluate(
    "//iframe[contains(@src, '$THIS_TokenID')]",
    element,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const iframeTokenIdsElement = iframeTokenIdsPaths.iterateNext()

  if (!iframeTokenIdsElement) return

  // TODO: [DEV-255] Does 'getAttribute' exist on type node? In NFT reducer
  const iframeSrc = (iframeTokenIdsElement as any).getAttribute('src')
  const updatedSrc = iframeSrc.replace('$THIS_TokenID', tokenId);
  (iframeTokenIdsElement as any).setAttribute('src', updatedSrc)
}

export const useRenderNfts = ({ nfts, item, element, getAssetElements }) => {

  useEffect(() => {
    if (!nfts) return

    nfts.forEach((nft, index) => {
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

      // Replace $Token_ID on text nodes or attribute elements
      displayTokenIdsOnAnchorLinks(clonedItem, nft?.token_id)
      displayTokenIdsOnSpanText(clonedItem, nft?.token_id)
      displayTokenIdsOnIframe(clonedItem, nft?.token_id)

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
