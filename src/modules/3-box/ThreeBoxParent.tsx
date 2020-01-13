import React, { FunctionComponent, useEffect, useState } from 'react'
import Box from '3box'

interface ThreeBoxParentProps {
  account: string;
}

export const ThreeBoxParent: FunctionComponent<ThreeBoxParentProps> = ({ account }) => {
  const [ userProfile, setUserProfile ] = useState()

  useEffect(() => {
    const getProfile = async () => {
      console.log('account', account)
      const profile = await Box.getProfile(account)
      console.log('profile', profile)
      setUserProfile(profile)
    }
    getProfile()
  }, [ account ])

  return null
}

