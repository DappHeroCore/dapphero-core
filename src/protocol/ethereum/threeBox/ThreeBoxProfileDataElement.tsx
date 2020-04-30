import { FunctionComponent, useMemo } from 'react'

interface ThreeBoxProfileDataElementProps {
  element: any;
  profileData: string;
}

export const ThreeBoxProfileDataElement: FunctionComponent<ThreeBoxProfileDataElementProps> = ({ element, profileData }) => {

  const memoizedValue = useMemo(
    () => element.innerText
    , [],
  )

  element.innerText = profileData || memoizedValue
  return null
}
