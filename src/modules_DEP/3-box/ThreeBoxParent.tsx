import React, { FunctionComponent, useEffect, useState } from 'react'
import { EthContractProps } from '../types'
import { ThreeBoxProfile } from './ThreeBoxProfile'
import { ThreeBoxProfileHover } from './ThreeBoxProfileHover'
import { ThreeBoxRequestString, ThreeBoxFeature } from './types'

type ThreeBoxParentProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'method' | 'instance'>
> & {
  account: string;
};

export const ThreeBoxParent: FunctionComponent<ThreeBoxParentProps> = ({
  account,
  signifiers,
  request: { requestString },
  element,
  injected,
}) => {
  const feature = requestString[ThreeBoxRequestString.FEATURE]

  switch (feature) {
  case ThreeBoxFeature.PROFILE: {
    return (
      <ThreeBoxProfile
        account={account}
        signifiers={signifiers}
        element={element}
      />
    )
  }

  case ThreeBoxFeature.PROFILE_HOVER: {
    return (
      <ThreeBoxProfileHover account={account} element={element} />
    )
  }

  default: {
    return null
  }

  }

  return null
}
