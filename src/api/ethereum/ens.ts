// import Web3 from 'web3' // I am disabling this to see if we can reduce bundle size.
import { ENSOptions } from './types'

// export const registry = (web3Instance: Web3): Web3['eth']['ens']['registry'] => web3Instance.eth.ens.registry

// export const resolver = (web3Instance: Web3, name: string): any => web3Instance.eth.ens.resolver(name)

export const getAddress = (
  web3Instance: any,
  ensName: string,
): Promise<string> => web3Instance.eth.ens.getAddress(ensName)

export const setAddress = (
  web3Instance: any,
  ensName: string,
  address: string,
  options?: ENSOptions,
): Promise<string> => (
  web3Instance.eth.ens.setAddress(ensName, address, options)
)

export const getContent = (
  web3Instance: any,
  ensName: string,
): Promise<string> => web3Instance.eth.ens.getContent(ensName)

export const setContent = (
  web3Instance: any,
  ensName: string,
  hash: string,
  options?: ENSOptions,
): Promise<string> => web3Instance.eth.ens.setContent(ensName, hash, options)
