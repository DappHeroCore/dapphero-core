import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from './api'
import {
  OpenSeaRequestString,
  OpenSeaViewProps,
  OpenSeaFallbacks
} from './types'
import { useDecimalFormatter, useUnitFormatter } from '../eth/utils'
import { getReturnValue } from './util'

export const OpenSeaViewArgsList: FunctionComponent<OpenSeaViewProps> = ({
  requestString,
  networkName,
  func,
  provider,
  signifiers,
  signifiers: { childElement },
  element,
  injected
}) => {
  // refactor
  useEffect(() => {
    const queryOpenSea = async () => {
      const args = requestString.slice(OpenSeaRequestString.ARGUMENTS)
      const resultObj = await openSeaApi(provider, func, args)

      if (!resultObj) return
      const { assets } = resultObj as any

      let itemTag
      // Pull out item-parent tag if it exists
      // users may want to define list item parent
      const elements = Array.prototype.slice
        .call(document.querySelectorAll(`[id^=${childElement}]`))
        .filter((el) => {
          if (el.id === `${childElement}-item`) {
            itemTag = el
            return false
          }
          return true
        })

      assets.forEach((item, i) => {
        let itemParent = itemTag || document.createElement('div')
        itemParent = itemParent.cloneNode(true)
        itemParent.style.display = 'block'

        elements.forEach((el, i) => {
          const node = el.cloneNode(true)
          const copyPath = el.id.split('-')[1].slice(1)

          const retVal = getReturnValue(item, copyPath)
          // TODO: factor out format flow for use everywhere
          const unitFormatted = useUnitFormatter(
            injected.lib,
            retVal,
            signifiers.unit
          )
          const decimalFormatted = useDecimalFormatter(
            unitFormatted,
            signifiers.decimals
          )
          // TODO: CORS error intermittently?
          // Some imgs may no longer have valid urls as well
          // We should add a fallback img option
          if (el.tagName === 'IMG') {
            decimalFormatted
              ? (node.src = decimalFormatted)
              : node.src = OpenSeaFallbacks.GIF
          } else {
            node.innerText = decimalFormatted
          }

          itemParent.appendChild(node)
        })
        element.appendChild(itemParent)
      })

      elements.forEach((el) => (el.style.display = 'none'))
    }
    queryOpenSea()
  }, [ requestString, networkName ])

  return null
}
