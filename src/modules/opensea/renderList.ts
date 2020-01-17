import { RequestString } from '../types'
import { OpenSeaFallbacks } from './types'
import { useUnitAndDecimalFormat, getReturnValueWithCopyPath } from '../utils'

export const renderList = (
  injected: any,
  assets: any[],
  parentTag: any,
  itemTag: any,
  signifiers: any
) => {
  const { childElement } = signifiers
  parentTag.innerHTML = ''
  assets.forEach((item, i) => {
    const itemParent = itemTag.cloneNode(true)
    itemParent.style.display = 'block'
    itemParent.style.backgroundColor = item.backgroundColor

    const { tokenAddress, tokenId } = item
    if (itemParent.href) {
      itemParent.href.concat(`?address=${tokenAddress}/&id=${tokenId}`)
      console.log('itemparent.href', itemParent.href)
    }

    const innerElements = itemTag.querySelectorAll(`[id^=${childElement}]`)

    innerElements.forEach((el, i) => {
      el.innerHTML = ''
      el.style.display = 'block'

      const node = el.cloneNode(true)
      const copyPath = el.id
        .split('-')[1]
        .slice(RequestString.SIGNIFIER_LENGTH)

      const retVal = getReturnValueWithCopyPath(item, copyPath)
      const unitAndDecimalFormatted = useUnitAndDecimalFormat(
        injected,
        retVal,
        signifiers
      )

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
