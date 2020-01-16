import { RequestString } from '../types'
import { OpenSeaFallbacks } from './types'
import { useUnitAndDecimalFormat } from '../utils'
import { getReturnValue } from './util'

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

    // beginning of navigating to item page
    /*  const onClick = () => {
        console.log(window.location)
        console.log('clicked')
        window.location.href = `asset/${item.tokenAddress}/${item.tokenId}`
    }

    itemParent.addEventListener('click', onClick) */

    const innerElements = itemTag.querySelectorAll(`[id^=${childElement}]`)

    innerElements.forEach((el, i) => {
      el.innerHTML = ''
      el.style.display = 'block'

      const node = el.cloneNode(true)
      const copyPath = el.id
        .split('-')[1]
        .slice(RequestString.SIGNIFIER_LENGTH)

      const retVal = getReturnValue(item, copyPath)
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
