import { useState, useEffect } from 'react'
/**
 * This is a hook that takes in a string to identify an element which contains a repeating item
 * returns information about the parent and item and other elements
 * @param childElement childElement
 * @returns {Object}
 */
export function useItemAndParentTags(repeatingContainerIdentifier: string): {
  parentTag: HTMLElement,
  itemTag: HTMLElement,
  baseElements: HTMLElement[],
} {
  const [ parentTag, setParentTag ] = useState(null) // parent of whole component block
  const [ itemTag, setItemTag ] = useState(null) // parent of list item
  const [ baseElements, setBaseElements ] = useState([])

  useEffect(() => {
    const elements = Array.prototype.slice // TODO: [DEV-92] Can this be refactored to use Array.from
      .call(document.querySelectorAll(`[id^=${repeatingContainerIdentifier}]`))
      .filter((elem) => {
        if (elem.id === `${repeatingContainerIdentifier}-parent`) {
          setParentTag(elem)
          return false
        }
        if (elem.id === `${repeatingContainerIdentifier}-item`) {
          setItemTag(elem)
          return false
        }
        return true
      })
    setBaseElements(elements)
  }, [])

  return {
    parentTag,
    itemTag,
    baseElements,
  }
}
