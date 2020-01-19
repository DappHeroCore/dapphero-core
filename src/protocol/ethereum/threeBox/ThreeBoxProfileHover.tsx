import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import ProfileHover from 'profile-hover'

interface ThreeBoxProfileHoverProps {
  account:string;
  element: any;
}

export const ThreeBoxProfileHover: FunctionComponent<ThreeBoxProfileHoverProps> = ({ account, element }) => {
  const ProfileComponent = (<ProfileHover address={account} tileStyle showName noTheme />)
  element.innerHTML = ''
  return ReactDOM.createPortal(
    ProfileComponent,
    element,
  )
}
