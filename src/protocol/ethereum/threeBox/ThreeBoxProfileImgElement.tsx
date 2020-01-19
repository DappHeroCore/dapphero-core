import { FunctionComponent } from 'react'

interface ThreeBoxProfileImgElementProps {
  element: HTMLImageElement;
  imgSrc: string;
}

export const ThreeBoxProfileImgElement: FunctionComponent<ThreeBoxProfileImgElementProps> = ({ element, imgSrc }) => {
  element.src = imgSrc
  return null
}
