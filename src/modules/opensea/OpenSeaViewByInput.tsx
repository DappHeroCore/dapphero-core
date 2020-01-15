import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from './api'
import {
  OpenSeaRequestString,
  OpenSeaViewProps,
  OpenSeaFallbacks
} from './types'
import { useDecimalFormatter, useUnitFormatter } from '../eth/utils'
import { RequestString } from '../types'
import { getReturnValue } from './util'

const SEARCH_INTERVAL = 500 // 500 ms

export const OpenSeaViewByInput: FunctionComponent<OpenSeaViewProps> = ({
  func,
  provider,
  requestString,
  element,
  signifiers,
  signifiers: { childElement },
  injected
}) => {
  const [ searchValue, setSearchValue ] = useState('')
  const [ baseElements, setBaseElements ] = useState([])
  const [ parentTag, setParentTag ] = useState(null) // parent of whole component block
  const [ itemTag, setItemTag ] = useState(null) // parent of list item
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
    if (!resultObj) return

    const { assets } = resultObj as any

    if (!parentTag || !baseElements || !assets) return null // required for this element

    parentTag.innerHTML = ''
    assets.forEach((item, i) => {
      let itemParent = itemTag || document.createElement('div')
      itemParent = itemParent.cloneNode(true)
      itemParent.style.display = 'block'

      baseElements.forEach((el, i) => {
        el.innerHTML = ''
        const node = el.cloneNode(true)
        const copyPath = el.id.split('-')[1].slice(RequestString.SIGNIFIER_LENGTH)

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

        if (el.tagName === 'IMG') {
          decimalFormatted
            ? (node.src = decimalFormatted)
            : node.src = OpenSeaFallbacks.GIF
        } else {
          node.innerText = decimalFormatted
        }

        el.style.display = 'block'

        itemParent.appendChild(node)
      })
      parentTag.appendChild(itemParent)
    })

    baseElements.forEach((el) => (el.style.display = 'none'))
  }

  useEffect(() => {
    const elements = Array.prototype.slice
      .call(document.querySelectorAll(`[id^=${childElement}]`))
      .filter((el) => {
        if (el.id === `${childElement}-parent`) {
          setParentTag(el)
          return false
        }
        if (el.id === `${childElement}-item`) {
          setItemTag(el)
          return false
        }
        return true
      })
    setBaseElements(elements)
    element.oninput = onInput
  }, [])

  useEffect(() => {
    renderElements()
  }, [ searchValue ])

  return null
}
