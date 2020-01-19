import React, { FunctionComponent, useEffect, useState } from '/modules/ethereum/openSea/node_modules/react'
import { openSeaApi } from '../../../api/openSea'
import { OpenSeaViewProps } from './types'
import { renderList } from './renderList'
import { useItemAndParentTags } from '../../utils'

const SEARCH_INTERVAL = 500 // 500 ms

export const OpenSeaViewByInput: FunctionComponent<OpenSeaViewProps> = ({
  func,
  provider,
  element,
  signifiers,
  signifiers: { childElement },
  injected,
}) => {
  const { parentTag, itemTag, baseElements } = useItemAndParentTags(childElement)
  const [ searchValue, setSearchValue ] = useState('')
  const [ timer, setTimer ] = useState(null)

  const onInput = (e) => {
    setTimer(null)
    setSearchValue((e.target as any).value)

    const timeout = setTimeout(renderElements, SEARCH_INTERVAL); //eslint-disable-line
    setTimer(timeout)
  }

  const renderElements = async () => {
    if (timer) return null
    const resultObj = await openSeaApi(provider, func, [ searchValue ])
    if (!resultObj || !itemTag) return

    const { assets } = resultObj as any
    if (!parentTag || !itemTag || !assets) return null // required for this element

    renderList(injected, assets, parentTag, itemTag, signifiers)

    baseElements.forEach((el) => (el.style.display = 'none'))
  }

  useEffect(() => {
    element.oninput = onInput
  }, [])

  useEffect(() => {
    renderElements()
  }, [ searchValue ])

  return null
}
