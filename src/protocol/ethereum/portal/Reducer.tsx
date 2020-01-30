import React from 'react'
import { PortalPayable } from './PortalPayable'
import { PortalUniswap } from './PortalUniswap'

export const Reducer = ({ element }) => {
  const [ , , infoType ] = element.id.split('-')
  switch (infoType) {
  case 'payable': {
    return <PortalPayable element={element} />
  }
  case 'uniswap': {
    return <PortalUniswap element={element} />
  }
  default: {
    return null
  }
  }
}
