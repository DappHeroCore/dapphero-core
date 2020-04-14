import { FunctionComponent, useMemo } from 'react'

interface ThreeBoxProfileImgElementProps {
  element: HTMLImageElement;
  imgSrc: string;
}

export const ThreeBoxProfileImgElement: FunctionComponent<ThreeBoxProfileImgElementProps> = ({ element, imgSrc }) => {
  const memoizedValue = useMemo(
    () => element.src
    , [],
  )
  console.log('Memo:', memoizedValue)

  if (!imgSrc) {
    element.removeAttribute('srcSet')
    element.src = memoizedValue
    return null
  }
  element.removeAttribute('srcSet')
  element.src = imgSrc
  return null

}
