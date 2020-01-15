import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from './api'
import {
  OpenSeaRequestString,
  OpenSeaViewProps,
  OpenSeaFallbacks
} from './types'
import { RequestString } from '../types'
import { getReturnValue } from './util'
import { useUnitAndDecimalFormat } from '../utils'

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
    if (!resultObj || !itemTag) return

    const { assets } = resultObj as any

    if (!parentTag || !baseElements || !assets) return null // required for this element
    parentTag.innerHTML = ''

    assets.forEach((item, i) => {
      const itemParent = itemTag.cloneNode(true)
      itemParent.style.display = 'block'

      const innerElements = itemTag.querySelectorAll(`[id^=${childElement}]`)
      innerElements.forEach((el, i) => {
        el.innerHTML = ''
        el.style.display = 'block'
        const node = el.cloneNode(true)
        const copyPath = el.id
          .split('-')[1]
          .slice(RequestString.SIGNIFIER_LENGTH)

        const retVal = getReturnValue(item, copyPath)
        const unitAndDecimalFormatted = useUnitAndDecimalFormat(injected, retVal, signifiers)

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
    setBaseElements(elements) // might no longer need
    element.oninput = onInput
  }, [])

  useEffect(() => {
    renderElements()
  }, [ searchValue ])

  return null
}
