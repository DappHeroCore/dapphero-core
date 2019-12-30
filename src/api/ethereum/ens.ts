import Web3 from "web3";
import { ENSOptions } from "./types";

export const registry = (
  web3Instance: Web3
): Web3["eth"]["ens"]["registry"] => {
  return web3Instance.eth.ens.registry;
};

export const resolver = (web3Instance: Web3, name: string): any => {
  return web3Instance.eth.ens.resolver(name);
};

export const getAddress = (
  web3Instance: Web3,
  ensName: string
): Promise<string> => {
  return web3Instance.eth.ens.getAddress(ensName);
};

export const setAddress = (
  web3Instance: Web3,
  ensName: string,
  address: string,
  options?: ENSOptions
): Promise<string> => {
  return web3Instance.eth.ens.setAddress(ensName, address, options);
};

export const getContent = (
  web3Instance: Web3,
  ensName: string
): Promise<string> => {
  return web3Instance.eth.ens.getContent(ensName);
};

export const setContent = (
  web3Instance: Web3,
  ensName: string,
  hash: string,
  options?: ENSOptions
): Promise<string> => {
  return web3Instance.eth.ens.setContent(ensName, hash, options);
};
