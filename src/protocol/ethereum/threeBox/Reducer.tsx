import React, { FunctionComponent, useEffect, useState } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import Box from '3box'
import { EthContractProps } from '../../../types/types'
import { ThreeBoxProfileDataElement } from './ThreeBoxProfile'
import { ThreeBoxProfileHover } from './ThreeBoxProfileHover'
import { ThreeBoxRequestString, ThreeBoxFeature } from './types'

interface ReducerProps {
  element: HTMLElement;
  featureType: 'name' | 'location' | 'website' | 'hover' | 'emoji'
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element, featureType }) => {

  const injected = useWeb3Injected()
  const { accounts } = injected

  const [ threeBoxProfile, setThreeBoxProfile ] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      const profile = await Box.getProfile(accounts[0])
      setThreeBoxProfile(profile)
    }
    getProfile()
  }, [ injected ])

  switch (featureType) {
  case 'name': {
    return (
      <ThreeBoxProfileDataElement
        element={element}
        profileData={threeBoxProfile.name}
      />
    )
  }
  case 'location':
  case 'emoji':
  case 'website': {
    return (
      <ThreeBoxProfileDataElement
        element={element}
      />
    )
  }

  case 'hover': {
    return (
      <ThreeBoxProfileHover element={element} />
    )
  }

  default: {
    return null
  }
  }
}
