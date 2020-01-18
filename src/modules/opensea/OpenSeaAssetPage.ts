import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from './api'
import { OpenSeaViewProps, OpenSeaFunctions, OpenSeaFallbacks } from './types'
import { RequestString } from '../types'
import {
  useItemAndParentTags,
  useUnitAndDecimalFormat,
  getReturnValueWithCopyPath
} from '../utils'

export const OpenSeaAssetPage: FunctionComponent<OpenSeaViewProps> = ({
  provider,
  signifiers,
  signifiers: { childElement, retVal },
  injected,
  element
}) => {
  const { parentTag } = useItemAndParentTags(childElement)
  useEffect(() => {
    if (!window.location.pathname.includes('asset-')) return
    if (!parentTag) return

    const queryOpenSea = async () => {
      const urlBreakdown = window.location.pathname.split('-')
      const assetIndex = urlBreakdown.indexOf('/asset')
      if (assetIndex === -1) return

      const contractId = urlBreakdown[assetIndex + 1]
      const assetId = urlBreakdown[assetIndex + 2]
      const resultObj = await openSeaApi(
        provider,
        OpenSeaFunctions.RETRIEVE_ASSET,
        [ contractId, assetId ]
      )

      const innerElements = parentTag.querySelectorAll(`[id^=${childElement}]`)
      innerElements.forEach((el) => {
        el.innerHTML = ''
        el.style.display = 'block'

        const node = el.cloneNode(true)
        const copyPath = el.id
          .split('-')[1]
          .slice(RequestString.SIGNIFIER_LENGTH)
        const returnVal = getReturnValueWithCopyPath(resultObj, copyPath)
        const unitAndDecimalFormatted = useUnitAndDecimalFormat(
          injected,
          returnVal,
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
    }
    queryOpenSea()
  }, [ parentTag ])

  return null
}
