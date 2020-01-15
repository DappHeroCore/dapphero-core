import Web3 from 'web3'
import { fromWei, toWei, hexToAscii, abridgedAddress } from '../../../../api/ethereum'

const FORMAT_MAPPING = {
  ether: fromWei,
  wei: toWei,
  ascii: hexToAscii,
  abridged: abridgedAddress
}

// value is either a return value from a call or an input value for a call
export const useUnitFormatter = (
  injected: Web3,
  value: any,
  format?: string
) => {
  if (!format || !value) return value
  if (format === 'abridged') {
    console.log('val', value)
    console.log('typeofval', typeof value)
    console.log('format', format)

  }

  const func = FORMAT_MAPPING[format]

  return func ? func(injected, value) : value
}
