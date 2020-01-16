import { useState, useEffect } from 'react'

export function useItemAndParentTags(childElement) {
  const [ parentTag, setParentTag ] = useState(null) // parent of whole component block
  const [ itemTag, setItemTag ] = useState(null) // parent of list item
  const [ baseElements, setBaseElements ] = useState([])

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
  }, [])

  return {
    parentTag,
    itemTag,
    baseElements
  }
}
