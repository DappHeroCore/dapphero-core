import React, { FunctionComponent, useEffect, useState } from 'react'
import Box from '3box'
import { getReturnValueWithCopyPath } from '../../../utils'

interface ThreeBoxProfileProps {
  account: string;
  signifiers: { [key: string]: string };
  element: any;
}

export const ThreeBoxProfile: FunctionComponent<ThreeBoxProfileProps> = ({
  account,
  signifiers,
  element,
}) => {
  const [ value, setValue ] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      const profile = await Box.getProfile(account)
      const retVal = getReturnValueWithCopyPath(profile, signifiers.retVal)
      setValue(retVal)
    }
    getProfile()
  }, [ account ])

  element.innerText = value

  return null
}
