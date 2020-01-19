import React, { FunctionComponent, useEffect, useState } from 'react'
import Box from '3box'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { getReturnValueWithCopyPath } from '../../../utils'

interface ThreeBoxProfileDataElementProps {
  element: HTMLElement;
  profileData: string;
}

export const ThreeBoxProfileDataElement: FunctionComponent<ThreeBoxProfileDataElementProps> = ({ element }) => {

  const injected = useWeb3Injected()
  const { accounts } = injected
  const [ value, setValue ] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      const profile = await Box.getProfile(accounts[0])
      const retVal = getReturnValueWithCopyPath(profile, signifiers.retVal)
      setValue(retVal)
    }
    getProfile()
  }, [ accounts ])

  element.innerText = value

  return null
}
