import { FunctionComponent } from 'react'

interface ThreeBoxProfileDataElementProps {
  element: HTMLElement;
  profileData: string;
}

export const ThreeBoxProfileDataElement: FunctionComponent<ThreeBoxProfileDataElementProps> = ({ element, profileData}) => {

  element.innerText = profileData
  return null
}
