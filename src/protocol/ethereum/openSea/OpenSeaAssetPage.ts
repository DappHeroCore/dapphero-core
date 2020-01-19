import { logger } from 'logger/logger'
import React, { FunctionComponent, useEffect } from 'react'
import { openSeaApi } from '../../../api/openSea'
import { OpenSeaViewProps, OpenSeaFunctions, OpenSeaFallbacks } from './types'
import { RequestString } from '../../../types/types'
import { useItemAndParentTags, useUnitAndDecimalFormat, getReturnValueWithCopyPath } from '../../../utils'

/**
 * The purpose of this file is to hanle the common usecase where a user would like a single webpage to
 * display the details about a single token. For example a website might have an index page of all tokens,
 * but when clicking on a signle token, we are taken to a webpage that displays only this single token.
 */
// TODO: what is the expected format of the URL
export const OpenSeaAssetPage: FunctionComponent<OpenSeaViewProps> = ({
  provider,
  signifiers,
  signifiers: { childElement, retVal },
  injected,
}) => {
  const { parentTag } = useItemAndParentTags(childElement)

  useEffect(() => {
    // Determines if window is an asset display window
    if (!window.location.pathname.includes('asset-')) return
    if (parentTag == null) return

    const queryOpenSea = async () => {
      try {
        const urlBreakdown = window.location.pathname.split('-')
        const assetIndex = urlBreakdown.indexOf('/asset')
        if (assetIndex >= 0) {

          const contractAddress = urlBreakdown[assetIndex + 1]
          const tokenId = urlBreakdown[assetIndex + 2]
          const responseObj = await openSeaApi(provider, OpenSeaFunctions.RETRIEVE_ASSET, [ contractAddress, tokenId ])
          const innerElements = (parentTag.querySelectorAll(`[id^=${childElement}]`) as NodeListOf<HTMLElement>)
          innerElements.forEach((el) => {
            el.innerHTML = ''
            el.style.display = 'block'

            const node = el.cloneNode(true) as HTMLElement & { src: any}
            const copyPath = el.id.split('-')[1].slice(RequestString.SIGNIFIER_LENGTH)
            const returnVal = getReturnValueWithCopyPath(responseObj, copyPath)
            const unitAndDecimalFormatted = useUnitAndDecimalFormat(injected, returnVal, signifiers)
            if (el.tagName === 'IMG') {
              node.src = unitAndDecimalFormatted || OpenSeaFallbacks.GIF
            } else {
              node.innerText = unitAndDecimalFormatted
            }

            el.replaceWith(node)
          })

        }
      } catch (err) {
        const newError = new Error(err)
        console.log(newError)
        throw newError
      }

    }
    queryOpenSea()
  }, [ parentTag ])

  return null
}
