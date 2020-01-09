import Web3 from 'web3'
import { fromWei, toWei, hexToAscii, bytesToHex, utf8ToHex } from '../../../../api/ethereum'
import { Signifiers } from '../../../types'

const FORMAT_MAPPING = {
  ether: fromWei,
  wei: toWei,
  ascii: hexToAscii
}

// value is either a return value from a call or an input value for a call
export const useUnitFormatter = (
  injected: Web3,
  value: any,
  format?: string
) => {
  if (!format || !value) return value

  const func = FORMAT_MAPPING[format]

  return func ? func(injected, value) : value
}
