import Web3Utils from 'web3-utils'

const FORMAT_MAPPING = {
  ether: Web3Utils.fromWei,
  wei: Web3Utils.toWei,
  ascii: Web3Utils.hexToAscii,
  abridged: (str) => str.slice(0, 6) + '...' + str.slice(38),
  string: (value) => value.toString(), // fixed?
}

// TODO: this function needs to be tested for invalid user formatting and decimal inputs
export const useDecimalAndDisplayFormat = (
  retVal: any,
  decimals: any,
  display: any,
) => {

  const displayFormatted = (injected, retVal, display) => {
    if (!display || !retVal) return retVal

    const func = FORMAT_MAPPING[display]

    return func ? func(retVal) : retVal
  }

  const decimalFormatted = (displayFormatted, decimals) => {

    if (!decimals) return displayFormatted
    return Number(displayFormatted).toFixed(Number(decimals))
  }

  return decimalFormatted
}
