import { useEffect, Children } from 'react'
import get from 'lodash.get'
import { ELEMENT_TYPES, TAG_TYPES, DATA_PROPERTY } from '@dapphero/dapphero-dom'

function displayValueOnAnchorLinks(element, key, value): void {
  const anchors = Array.from(element.querySelectorAll('a'))
  anchors.forEach((anchor: Element) => {
    const href = anchor.getAttribute('href')
    if (href.includes(key)) {
      anchor.setAttribute('href', href.replace(key, value))
    }
  })
}

// function displayKeyValueElementInnerText2(element, key, value, selectedAttribute, elementType): void {
//   const matchingElements = Array.from(element.querySelectorAll(elementType))
//   matchingElements.forEach((el: Element) => {
//     // TODO: Understand why this eliminated images
//     if (element.innerText.includes(key)) {
//       element.innerText = element.innerText.replace(key, value)
//     }
//   })
// }

// TODO: [DEV-291] Prevent from Deleting Nested Elements
function displayKeyValueElementInnerText(element, key, value, elementType): void {
  const spanTokenIdsPaths = document.evaluate(
    `//${elementType}[contains(., '${key}')]`,
    element,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const spanTokenIdsElement = spanTokenIdsPaths.iterateNext()
  if (!spanTokenIdsElement) return
  Object.assign(spanTokenIdsElement, { textContent: value }) // TODO: Can we get original value as well? So "hello $THIS_TokenID" keeps Hello as well?
}

function displayValueOnElementAttribute(element, key, value, selectedAttribute, elementType): void {
  const values = Array.from(element.querySelectorAll(`${elementType}[${selectedAttribute}="${key}"`))
  values.forEach((formValue: Element) => {
    const attribute = formValue.getAttribute(selectedAttribute)
    if (attribute.includes(key)) {
      formValue.setAttribute(selectedAttribute, attribute.replace(key, value))
    }
  })
}

// function displayKeyValueOnIframe(element, key, value): void {
//   const iframeKeyValuePaths = document.evaluate(
//     `//iframe[contains(@src, '${key}')]`,
//     element,
//     null,
//     XPathResult.ANY_TYPE,
//     null,
//   )
//   const iframeKeyValueElement = iframeKeyValuePaths.iterateNext()

//   if (!iframeKeyValueElement) return

//   // TODO: [DEV-255] Does 'getAttribute' exist on type node? In NFT reducer
//   const iframeSrc = (iframeKeyValueElement as any).getAttribute('src')
//   const updatedSrc = iframeSrc.replace(key, value);
//   (iframeKeyValueElement as any).setAttribute('src', updatedSrc)
// }

export const useRenderNfts = ({ nfts, item, element, getAssetElements }) => {

  // Replace label elements in their "for" attribute having $THIS_ContractAddress value
  useEffect(() => {
    if (!nfts) return

    nfts.forEach((nft, index) => {
      item.childrens.forEach((childrenItem) => {
        const labels = childrenItem.element.querySelectorAll('label[for="$THIS_ContractAddress"')

        labels.forEach((label) => {
          const labelSrc = label.getAttribute('for')
          const updatedSrc = labelSrc.replace('$THIS_ContractAddress', nft?.asset_contract.address)

          label.setAttribute('src', updatedSrc)
        })
      })
    })
  }, [ nfts ])

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

      //

      const clonedItem = item.root.cloneNode(true)

      // // // displayTokenInfoOnAnchorLinks(clonedItem, nft?.token_id)
      displayValueOnAnchorLinks(clonedItem, '$THIS_TokenID', nft?.token_id)
      displayValueOnAnchorLinks(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      displayValueOnAnchorLinks(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // Array of attributes for whih we can substitute our $THIS value
      const attributes = [ 'value', 'for', 'placeholder',
        'id', 'name', 'data-dh-property-tag-id',
        'data-dh-property-method-id', 'data-dh-property-asset-contract-address' ]

      // Replace the Inner text for any element type.
      // Array.from(item.root.children).forEach((element) => {
      //   displayKeyValueElementInnerText(clonedItem, '$THIS_TokenID', nft?.token_id, element.nodeName)
      //   displayKeyValueElementInnerText(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address, element.nodeName)
      //   displayKeyValueElementInnerText(clonedItem, '$THIS_OwnerAddress', nft?.owner.address, element.nodeName)
      // })

      // Substitute the $THIS value on any attribute from array above, for any child element.
      console.log(item.root.children)
      Array.from(item.root.children).forEach((element) => {
        attributes.forEach((attribute) => {
          displayValueOnElementAttribute(clonedItem, '$THIS_TokenID', nft?.token_id, attribute, element.nodeName)
          displayValueOnElementAttribute(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address, attribute, element.nodeName)
          displayValueOnElementAttribute(clonedItem, '$THIS_OwnerAddress', nft?.owner.address, attribute, element.nodeName)
        })

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

}
