import Web3 from 'web3'
import { fromWei, toWei, hexToAscii, abridgedAddress } from '../api/ethereum'

const FORMAT_MAPPING = {
  ether: fromWei,
  wei: toWei,
  ascii: hexToAscii,
  abridged: abridgedAddress,
  string: (injected, value) => value.toString(), // fixed?
}

// value is either a return value from a call or an input value for a call
export const useDisplayFormatter = (
  injected: Web3,
  value: any,
  format?: string,
) => {
  if (!format || !value) return value

  const func = FORMAT_MAPPING[format]

  return func ? func(injected, value) : value
}
