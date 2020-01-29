import React from 'react'
import { PortalPayable } from './PortalPayable'

export const Reducer = ({ element }) => {
  const [ , , infoType ] = element.id.split('-')
  switch (infoType) {
  case 'payable': {
    return <PortalPayable element={element} />
  }
  default: {
    return null
  }
  }
}
