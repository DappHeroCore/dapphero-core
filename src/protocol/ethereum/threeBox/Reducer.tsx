import React, { FunctionComponent, useEffect, useState } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import Box from '3box'
import { EthContractProps } from '../../../types/types'
import { ThreeBoxProfileDataElement } from './ThreeBoxProfileDataElement'
import { ThreeBoxProfileHover } from './ThreeBoxProfileHover'
import { ThreeBoxRequestString, ThreeBoxFeature } from './types'

interface ReducerProps {
  element: HTMLElement;
  // featureType: 'name' | 'location' | 'website' | 'hover' | 'emoji'
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element }) => {

  const injected = useWeb3Injected()
  const { accounts } = injected
  const [ threeBoxProfile, setThreeBoxProfile ] = useState({})
  const featureType = element.id.split('-')[3]


  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await Box.getProfile(accounts[0])
        setThreeBoxProfile(profile)
      } catch (error) {
        console.log('You have no profile. ', error)
      }
    }
    getProfile()
  }, [ accounts ])


  switch (featureType) {
  case 'name': {
    return (
      <ThreeBoxProfileDataElement
        element={element}
        profileData={threeBoxProfile.name}
      />
    )
  }
  case 'location': {
    return (
      <ThreeBoxProfileDataElement
        element={element}
        profileData={threeBoxProfile.location}
      />
    )
  }
  case 'emoji': {
    return (
      <ThreeBoxProfileDataElement
        element={element}
        profileData={threeBoxProfile.emoji}
      />
    )
  }
  case 'website': {
    return (
      <ThreeBoxProfileDataElement
        element={element}
        profileData={threeBoxProfile.website}
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
