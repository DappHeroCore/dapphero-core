declare global {
  interface Window {
    web3?: any;
    ethereum: any;
    dappHero?: {
      enabled: true;
      contracts: any;
      domElements: Element[];
      configuration: {
        [key: string]: any;
        contracts: any[];
      };
      projectId: string;
      debug: boolean;
    };
  }
}

export type EthereumUnits = 'wei' | 'ether'

export interface DappHeroConfiguration {
  contracts: {[key: string]: any}[];
}

export interface Request {
  requestString: string[];
  element: HTMLElement;
  feature: string;
  index: number;
}

export interface Network {
  networkId?: number;
  address?: string;
  abi?: {[key: string]: any};
}

export interface DappHeroConfig {
  contracts: any[];
  contractName?: string;
  network?: Network;
}

export type EthContractProps = {
  method: any; // add type
  element: HTMLElement;
  request: Request;
  injected: { [key: string]: any };
  signifiers: { [key: string]: string };
  instance: any; // build this type
  mock?: {
    abi: any[];
    contractAddress: string;
  };
}

export enum FunctionTypes {
  VIEW = 'view',
  NONPAYABLE = 'nonpayable',
  PAYABLE = 'payable'
}

export enum RequestString {
  ETH_PARENT_TYPE = 2,
  ETH_CONTRACT_FUNCTION = 3,
  ETH_CONTRACT_ARGS = 4,
  SIGNIFIER_LENGTH = 2
}

export enum ModuleTypes {
  ADDRESS = 'address',
  GET_BALANCE = 'getBalance',
  GET_PROVIDER = 'getProvider',
  GET_NETWORK_NAME = 'getNetworkName',
  GET_NETWORK_ID = 'getNetworkId',
  ENABLE = 'enable',
  THREE_BOX = '3box', // key can't start with num
  OPENSEA = 'opensea'
}
