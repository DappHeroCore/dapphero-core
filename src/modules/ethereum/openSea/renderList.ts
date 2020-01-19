import { RequestString } from '../../types'
import { OpenSeaFallbacks } from './types'
import { useUnitAndDecimalFormat, getReturnValueWithCopyPath } from '../../utils'

export const renderList = (
  injected: any,
  assets: any[],
  parentTag: any,
  itemTag: any,
  signifiers: any,
) => {
  const { childElement } = signifiers

  /* remove all non-dh items within itemtag from DOM (
    still exists within list item
  ) */
  const otherElements = itemTag.querySelectorAll('*')
  otherElements.forEach((el) => {
    if (!el.id || !el.id.startsWith(childElement)) {
      el.style.display = 'none'
    }
  })

  parentTag.innerHTML = ''
  assets.forEach((item, i) => {
    const itemParent = itemTag.cloneNode(true)
    itemParent.style.display = 'block'
    itemParent.style.backgroundColor = item.backgroundColor

    const { tokenAddress, tokenId } = item
    if (itemParent.href) {
      itemParent.href.concat(`?address=${tokenAddress}/&id=${tokenId}`)
    }

    const innerElements = itemTag.querySelectorAll(`[id^=${childElement}]`)

    innerElements.forEach((el, i) => {
      el.innerHTML = ''
      el.style.display = 'block'
      // TODO: delete all child (list) elements on render, in case designers has prepopulated with demo placeholder items

      const node = el.cloneNode(true)
      // taking out signifier tag to allow for clean traversal of api return object
      // e.g. 'zrowner.address' => obj[owner][address]
      const copyPath = el.id
        .split('-')[1]
        .slice(RequestString.SIGNIFIER_LENGTH)

      const retVal = getReturnValueWithCopyPath(item, copyPath)
      const unitAndDecimalFormatted = useUnitAndDecimalFormat(
        injected,
        retVal,
        signifiers,
      )

      /* usually we will just be changing inner text of element, but in the case of img elements, we want to change src attribute */
      if (el.tagName === 'IMG') {
        unitAndDecimalFormatted
          ? (node.src = unitAndDecimalFormatted)
          : (node.src = OpenSeaFallbacks.GIF)
      } else {
        node.innerText = unitAndDecimalFormatted
      }

      el.replaceWith(node)
    })
    parentTag.appendChild(itemParent)
  })
}
