export interface Request {
  requestString: string[];
  element: HTMLElement;
  arg: string;
  index: number;
}

export interface Network {
  networkId?: number;
  address?: string;
  abi?: {[key: string]: any};
}
export interface dappHeroConfig {
  contractName?: string,
  network?: Network;
};

