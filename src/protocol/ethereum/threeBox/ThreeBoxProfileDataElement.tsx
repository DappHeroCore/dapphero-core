import { FunctionComponent } from 'react'

interface ThreeBoxProfileDataElementProps {
  element: HTMLElement;
  profileData: string;
}

export const ThreeBoxProfileDataElement: FunctionComponent<ThreeBoxProfileDataElementProps> = ({ element, profileData }) => {
  if (profileData == null) return null
  element.innerText = profileData
  return null
}
