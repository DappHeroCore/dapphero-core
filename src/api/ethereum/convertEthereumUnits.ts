import { EthereumUnits } from 'types/types'

// TODO: [DEV-96] Import type from correct library
type BN = any
type Web3Lib = any

export const convertEthereumUnits = (web3Lib: Web3Lib, value: string | BN, inputUnits: EthereumUnits, outputUnits: EthereumUnits): string => {

  switch (inputUnits) {
  case 'wei': {
    switch (outputUnits) {
    case 'wei':
      return value
    case 'ether':
      return web3Lib.utils.fromWei(value, 'ether')
    default:
      return null
    }
  }

  case 'ether': {
    switch (outputUnits) {
    case 'wei':
      return web3Lib.utils.toWei(value, 'ether')
    case 'ether':
      return value
    default:
      return null
    }
  }

  default:
    return null
  }
}

