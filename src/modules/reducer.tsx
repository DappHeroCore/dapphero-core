import React from 'react'
import { Request, DappHeroConfig } from './types'
import { EthParent } from './eth'

const getConfig = (): DappHeroConfig => {
  const configElement = document.getElementById('dh-config')
  // TODO Clean this data to prevent injections
  const config: DappHeroConfig = JSON.parse(configElement.textContent)
  // Hide the Element if not hidden.
  if (configElement.style.display !== 'none') {
    configElement.style.display = 'none'
  }
  return config
}

// This increments a key so each element out of reducer has unique Key so react doesn't complain.
let reactKeyIndex = 0

export const reducer = (request: Request) => {
  switch (request.arg) {
  case 'eth': {
    const config = getConfig()
    reactKeyIndex += 1
    return (
      <EthParent request={request} config={config} key={reactKeyIndex} />
    )
  }
  default:
    return null
  }
}
