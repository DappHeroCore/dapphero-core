import React, { FunctionComponent, useEffect, useState } from 'react'
import { logger } from 'logger/customLogger'
import * as hooks from 'hooks'
import { ThreeBoxProfileDataElement } from './ThreeBoxProfileDataElement'
import { ThreeBoxProfileImgElement } from './ThreeBoxProfileImgElement'

const { getProfile: get3boxProfile } = require('3box/lib/api')

const ipfsRoot = 'https://cloudflare-ipfs.com/ipfs/'
interface ReducerProps {
  element: HTMLElement
  info: any
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element, info }) => {
  const injected = hooks.useDappHeroWeb3()
  const { accounts } = injected
  const [ threeBoxProfile, setThreeBoxProfile ] = useState({
    name: '',
    location: '',
    emoji: '',
    job: '',
    description: '',
    website: '',
    image: [
      { contentUrl: { '/': '' } },
    ],
  })

  useEffect(() => {
    const getProfile = async () => {
      try {
        // TODO: [DEV-97] How to we check the status of a request? When no Profile this 404's
        const profile = await get3boxProfile(accounts[0])
        setThreeBoxProfile(profile)
      } catch (error) {
        logger.debug('You have no profile. ', error)
      }
    }
    getProfile()
  }, [ accounts ])

  switch (info?.properties[0]?.key) {
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
