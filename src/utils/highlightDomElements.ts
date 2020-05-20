// handlers
import get from 'lodash.get'

export const highlightDomElements = (shouldHighlight: boolean, domElements: any): void => {
  if (!domElements) return

  const styleDappHeroElement = (element: HTMLElement): void => {
    Object.assign(element.style, { border: shouldHighlight ? `2px solid red` : `none` })
  }

  domElements.forEach((domElement) => {
    const element: HTMLElement = get(domElement, 'element')

    const childrenElements: HTMLElement[] = get(domElement, 'childrenElements', [])
      .map((childrenElement: { element: HTMLElement & { element: HTMLElement; id: string }[] }) => {
        if (Array.isArray(childrenElement.element)) {
          return childrenElement.element.map((subElements) => subElements.element)
        }

        return childrenElement.element
      })
      .flat()

    if (element) {
      styleDappHeroElement(element)
    }

    if (childrenElements.length) {
      childrenElements.forEach(styleDappHeroElement)
    }
  })
}
