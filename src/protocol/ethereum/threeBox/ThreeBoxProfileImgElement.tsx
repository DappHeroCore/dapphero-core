import { FunctionComponent, useMemo } from 'react'

interface ThreeBoxProfileImgElementProps {
  element: any;
  imgSrc: string;
}

export const ThreeBoxProfileImgElement: FunctionComponent<ThreeBoxProfileImgElementProps> = ({ element, imgSrc }) => {
  const memoizedValue = useMemo(
    () => element.src
    , [],
  )

  if (!imgSrc) {
    element.removeAttribute('srcSet')
    element.src = memoizedValue
    return null
  }
  element.removeAttribute('srcSet')
  element.src = imgSrc
  return null

}
