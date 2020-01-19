import React, { FunctionComponent, useEffect, useState } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import Box from '3box'
import { EthContractProps } from '../../../types/types'
import { ThreeBoxProfileDataElement } from './ThreeBoxProfileDataElement'
import { ThreeBoxProfileImgElement } from './ThreeBoxProfileImgElement'
import { ThreeBoxProfileHover } from './ThreeBoxProfileHover'
import { ThreeBoxRequestString, ThreeBoxFeature } from './types'

const ipfsRoot = 'https://cloudflare-ipfs.com/ipfs/'
interface ReducerProps {
  element: HTMLElement
  // featureType: 'name' | 'location' | 'website' | 'hover' | 'emoji'
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element }) => {
  const injected = useWeb3Injected()
  const { accounts } = injected
  const [ threeBoxProfile, setThreeBoxProfile ] = useState({})
  const featureType = element.id.split('-')[3]

  console.log(threeBoxProfile)

  useEffect(() => {
    const getProfile = async () => {
      try {
        // TODO: [DEV-97] How to we check the status of a request? When no Profile this 404's
        const profile = await Box.getProfile(accounts[0])
        setThreeBoxProfile(profile)
      } catch (error) {
        console.log('You have no profile. ', error)
      }
    }
    getProfile()
  }, [ accounts ])

  switch (featureType) {
  case 'image': {
    const imageHash = threeBoxProfile?.image?.[0]?.contentUrl?.['/'] ?? null
    if (imageHash) {
      const imgSrc = `${ipfsRoot}${threeBoxProfile.image[0].contentUrl['/']}`
      return <ThreeBoxProfileImgElement element={element} imgSrc={imgSrc} />
    } 
    return null
  }
  case 'name': {
    return <ThreeBoxProfileDataElement element={element} profileData={threeBoxProfile.name} />
  }
  case 'location': {
    return <ThreeBoxProfileDataElement element={element} profileData={threeBoxProfile.location} />
  }
  case 'emoji': {
    return <ThreeBoxProfileDataElement element={element} profileData={threeBoxProfile.emoji} />
  }
  case 'job': {
    return <ThreeBoxProfileDataElement element={element} profileData={threeBoxProfile.job} />
  }
  case 'description': {
    return <ThreeBoxProfileDataElement element={element} profileData={threeBoxProfile.description} />
  }
  case 'website': {
    return <ThreeBoxProfileDataElement element={element} profileData={threeBoxProfile.website} />
  }

  // TODO: [DEV-98] Build custom 3box profile ToolTip for Profiles
  // TODO: [DEV-99] Build element which swaps out Addresses for ThreeBox profile names
  default: {
    return null
  }
  }
}
