import Web3 from 'web3'
import { fromWei, toWei, hexToAscii } from '../../../api/ethereum'

const FORMAT_MAPPING = {
  fromWei,
  toWei
}

// value is either a return value from a call or an input value for a call
export const useFormatter = (
  injected: Web3,
  value: any,
  format: string,
  decimals?: number
) => {
  const func = FORMAT_MAPPING[format]
  const newVal = func ? func(injected, value) : value

  return newVal
}
