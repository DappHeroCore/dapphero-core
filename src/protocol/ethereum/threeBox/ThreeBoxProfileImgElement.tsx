import { FunctionComponent } from 'react'

interface ThreeBoxProfileImgElementProps {
  element: HTMLImageElement;
  imgSrc: string;
}

export const ThreeBoxProfileImgElement: FunctionComponent<ThreeBoxProfileImgElementProps> = ({ element, imgSrc }) => {
  if (imgSrc == null) return null
  element.src = imgSrc
  return null
}
