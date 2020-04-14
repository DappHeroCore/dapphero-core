import { FunctionComponent, useMemo } from 'react'

interface ThreeBoxProfileDataElementProps {
  element: HTMLElement;
  profileData: string;
}

export const ThreeBoxProfileDataElement: FunctionComponent<ThreeBoxProfileDataElementProps> = ({ element, profileData }) => {

  const memoizedValue = useMemo(
    () => element.innerText
    , [],
  )

  if (!profileData) {
    element.innerText = memoizedValue
    return null
  }
  element.innerText = profileData
  return null

}
