import React, { FunctionComponent, useEffect, useState, useContext } from 'react'
import * as contexts from 'contexts'
import { useWeb3React } from '@web3-react/core'
import { logger } from 'logger/customLogger'
import { getProfile } from '3box/lib/api'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { ThreeBoxProfileDataElement } from './ThreeBoxProfileDataElement'
import { ThreeBoxProfileImgElement } from './ThreeBoxProfileImgElement'

const get3boxProfile = getProfile

const ipfsRoot = 'https://cloudflare-ipfs.com/ipfs/'
interface ReducerProps {
  element: Element;
  info: any;
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element, info }) => {

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // const injectedContext = useWeb3React()
  // const { address } = injectedContext
  const defaultProfile = {
    name: null,
    location: null,
    emoji: null,
    job: null,
    description: null,
    website: null,
    image: [
      { contentUrl: { '/': null } },
    ],
  }
  const [ threeBoxProfile, setThreeBoxProfile ] = useState({
    name: null,
    location: null,
    emoji: null,
    job: null,
    description: null,
    website: null,
    image: [
      { contentUrl: { '/': null } },
    ],
  })

  const ethereum = useContext(contexts.EthereumContext)
  const { address, isEnabled } = ethereum
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: [DEV-97] How to we check the status of a request? When no Profile this 404's
        emitToEvent(
          EVENT_NAMES.threeBox.loadProfile,
          { value: null, step: 'Three Box Profile Load', status: EVENT_STATUS.pending },
        )
        const profile = await get3boxProfile(address)
        emitToEvent(
          EVENT_NAMES.threeBox.loadProfile,
          { value: profile, step: 'Three Box Profile Load', status: EVENT_STATUS.resolved },
        )
        setThreeBoxProfile(profile)
      } catch (error) {
        emitToEvent(
          EVENT_NAMES.threeBox.loadProfile,
          { value: error, step: 'Three Box Profile Load Error', status: EVENT_STATUS.rejected },
        )
        logger.log('You have no profile. ', error)
      }
    }
    if (isEnabled)fetchProfile()
  }, [ address, isEnabled ])

  switch (info?.properties[0]?.key) {
    case 'image': {
      const imageHash = threeBoxProfile?.image?.[0]?.contentUrl?.['/'] ?? null
      if (imageHash && isEnabled) {
        const imgSrc = `${ipfsRoot}${threeBoxProfile.image[0].contentUrl['/']}`
        return <ThreeBoxProfileImgElement element={element} imgSrc={imgSrc} />
      }
      return <ThreeBoxProfileImgElement element={element} imgSrc={null} />

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
