import React from 'react'

import { EthUserBalance } from './EthUserBalance'
import { EthUserAddress } from './EthUserAddress'

export const Reducer = ({ element, info }) => {

  const [ units ] = info?.modifiers?.filter((modifier) => modifier.key === 'units') ?? null
  const [ decimals ] = info?.modifiers?.filter((modifier) => modifier.key === 'decimals') ?? null
  const [ displayFormat ] = info?.modifiers?.filter((modifier) => modifier.key === 'display') ?? null

  switch (info?.properties[0]?.key) {
    case 'address': {
      return (
        <EthUserAddress
          element={element}
          displayFormat={displayFormat?.value}
        />
      )
    }
    case 'balance': {
      return (
        <EthUserBalance
          element={element}
          units={units?.value}
          decimals={decimals?.value}
        />
      )
    }
    default:
      return null
  }
}
