import React from 'react'
import { EthUserBalance } from './EthUserBalance'
import { EthUserAddress } from './EthUserAddress'

export const Reducer = ({ element, configuration }) => {

  const infoType = element.id.split('-')[2]

  const match = element.id.match(/-decimals_(\d+)/)?.[1] ?? null
  const decimals = match ? parseInt(match) : null

  const units = element.id.match(/-units_([a-z]+)/)?.[1] ?? null
  const displayFormat = element.id.match(/-display_([a-z]+)/)?.[1] ?? null

  switch (infoType) {
  case 'address': {
    return (
      <EthUserAddress
        element={element}
        displayFormat={displayFormat}
      />
    )
  }
  case 'balance': {
    return (
      <EthUserBalance
        element={element}
        units={units}
        decimals={decimals}
      />
    )
  }
  default:
    return null
  }
}
