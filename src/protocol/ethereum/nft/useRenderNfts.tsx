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

function displayKeyValueInnerTextButton(element, key, value): void {
  const spanTokenIdsPaths = document.evaluate(
    `//button[contains(., '${key}')]`,
    element,
    null,
    XPathResult.ANY_TYPE,
    null,
  )
  const spanTokenIdsElement = spanTokenIdsPaths.iterateNext()

  if (!spanTokenIdsElement) return
  Object.assign(spanTokenIdsElement, { textContent: value })
}

function displayKeyValueInnerElement(element, key, value, elementType): void {
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
  console.log('functiondisplayValueOnElementAttribute -> selectedAttribute, elementType', selectedAttribute, elementType)
  const values = Array.from(element.querySelectorAll(`${elementType}[${selectedAttribute}="${key}"`))
  values.forEach((formValue: Element) => {
    const attribute = formValue.getAttribute(selectedAttribute)
    if (attribute.includes(key)) {
      formValue.setAttribute(selectedAttribute, attribute.replace(key, value))
    }
  })
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

function displayValueOnFormFor(element, key, value): void {
  const formFORs = Array.from(element.querySelectorAll(`label[for="${key}"`))
  formFORs.forEach((formFor: Element) => {
    const attribute = formFor.getAttribute('for')
    if (attribute.includes(key)) {
      formFor.setAttribute('for', attribute.replace(key, value))
    }
  })
}

function displayValueOnFormInput(element, key, value, selectedAttribute): void {
  const formValues = Array.from(element.querySelectorAll(`input[${selectedAttribute}="${key}"`))
  formValues.forEach((formValue: Element) => {
    const attribute = formValue.getAttribute(selectedAttribute)
    if (attribute.includes(key)) {
      formValue.setAttribute(selectedAttribute, attribute.replace(key, value))
    }
  })
}

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

      // /////

      const clonedItem = item.root.cloneNode(true)

      // Replace $THIS_TokenID/ContractAddress/OwnerAddress on Anchor links, Spans or Iframes.

      // // displayKeyValueInnerTextButton
      // displayKeyValueInnerTextButton(clonedItem, '$THIS_TokenID', nft?.token_id)
      // displayKeyValueInnerTextButton(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      // displayKeyValueInnerTextButton(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // // displayTokenInfoOnAnchorLinks(clonedItem, nft?.token_id)
      displayValueOnAnchorLinks(clonedItem, '$THIS_TokenID', nft?.token_id)
      displayValueOnAnchorLinks(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      displayValueOnAnchorLinks(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // // displayTokenInfoOnSpanText(clonedItem, nft?.token_id)
      // displayKeyValueOnSpanText(clonedItem, '$THIS_TokenID', nft?.token_id)
      // displayKeyValueOnSpanText(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      // displayKeyValueOnSpanText(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // // displayTokenInfoOnIframe(clonedItem, nft?.token_id)
      // displayKeyValueOnIframe(clonedItem, '$THIS_TokenID', nft?.token_id)
      // displayKeyValueOnIframe(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      // displayKeyValueOnIframe(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // // Substitution $THIS Keyword in Forms:

      // // First we substitute any Form Labels, "<label for=...></label>"
      // displayValueOnFormFor(clonedItem, '$THIS_TokenID', nft?.token_id)
      // displayValueOnFormFor(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address)
      // displayValueOnFormFor(clonedItem, '$THIS_OwnerAddress', nft?.owner.address)

      // Array of attributes for whih we can substitute our $THIS value
      const attributes = [ 'value', 'for',
        'id', 'name', 'data-dh-property-tag-id',
        'data-dh-property-method-id',
        'data-dh-property-asset-contract-address' ]

      // attributes.forEach((attribute) => {
      //   displayValueOnFormInput(clonedItem, '$THIS_TokenID', nft?.token_id, attribute)
      //   displayValueOnFormInput(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address, attribute)
      //   displayValueOnFormInput(clonedItem, '$THIS_OwnerAddress', nft?.owner.address, attribute)
      // })

      // // Replace the Inner text for any element type.
      Array.from(item.root.children).forEach((element) => {
        displayKeyValueInnerElement(clonedItem, '$THIS_TokenID', nft?.token_id, element.nodeName)
        displayKeyValueInnerElement(clonedItem, '$THIS_ContractAddress', nft?.asset_contract.address, element.nodeName)
        displayKeyValueInnerElement(clonedItem, '$THIS_OwnerAddress', nft?.owner.address, element.nodeName)
      })

      // Substitute the $THIS value on any attribute from array above, for any child element.
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
