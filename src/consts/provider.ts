export const providerSchema = {
  provider: null,
  providerType: null,
  chainId: null,
  networkName: null,
  signer: null,
  isEnabled: false,
  enable: null,
  address: null,
}

export const readProviders = {
  mainnet: {
    http: 'https://eth-mainnet.alchemyapi.io/v2/CnbMV4_Qz6cOngXIVJDRLU34yIfp2xIb',
    ws: 'wss://eth-mainnet.ws.alchemyapi.io/v2/CnbMV4_Qz6cOngXIVJDRLU34yIfp2xIb',
  },
  rinkeby: {
    http: 'https://eth-rinkeby.alchemyapi.io/v2/vWgMeBNcpq5cgTxG2wg0AjBEub_Fv0gF',
    ws: 'wss://eth-rinkeby.ws.alchemyapi.io/v2/vWgMeBNcpq5cgTxG2wg0AjBEub_Fv0gF',
  },
  ropsten: {
    http: 'https://eth-ropsten.alchemyapi.io/v2/1RTNsM-Cj1h8baw8mPm1K5ML-IEXRGHu',
    ws: 'wss://eth-ropsten.ws.alchemyapi.io/v2/1RTNsM-Cj1h8baw8mPm1K5ML-IEXRGHu',
  },
  kovan: {
    http: 'https://eth-kovan.alchemyapi.io/v2/CLg7Mum7R5A-URTticJ_0imkMZzEbT1E',
    ws: 'wss://eth-kovan.ws.alchemyapi.io/v2/CLg7Mum7R5A-URTticJ_0imkMZzEbT1E',
  },
  goerli: {
    http: 'https://eth-goerli.alchemyapi.io/v2/mo2KeoBlZY6CAyc2o1i4BcBNioVN_wpJ',
    ws: 'wss://eth-goerli.ws.alchemyapi.io/v2/mo2KeoBlZY6CAyc2o1i4BcBNioVN_wpJ',
  },
  xDai: {
    http: 'https://dai.poa.network',
    ws: 'wss://dai-trace-ws.blockscout.com/ws',
  },

}
