import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from './api'
import {
  OpenSeaRequestString,
  OpenSeaViewProps,
  OpenSeaFallbacks
} from './types'
import { renderList } from './renderList'
import { useItemAndParentTags } from '../utils'

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
  const { parentTag, itemTag, baseElements } = useItemAndParentTags(childElement)

  useEffect(() => {
    const queryOpenSea = async () => {
      const args = requestString.slice(OpenSeaRequestString.ARGUMENTS)
      const resultObj = await openSeaApi(provider, func, args)

      if (!resultObj || !itemTag || !parentTag) return
      const { assets } = resultObj as any
      console.log('assets', assets)

      renderList(injected, assets, parentTag, itemTag, signifiers)
    }
    queryOpenSea()

    baseElements.forEach((el) => (el.style.display = 'none'))
  }, [ requestString, networkName, parentTag, itemTag ])

  return null
}
