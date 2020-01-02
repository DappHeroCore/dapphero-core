export interface Request {
  requestString: string[];
  element: HTMLElement;
  arg: string;
  index: number;
}

export interface Network {
  networkId?: number;
  address?: string;
  abi?: any;
}
export interface DappHeroConfig {
  contractName?: string,
  network?: Network;
};
