import Web3 from "web3";
import BN from "bn.js";

export interface TransactionObject {
  from: string | number; // address or address index
  to?: string; // only optional for contract creation
  value?: number | string | BN; // wei

  // more optional
  gas?: number;
  gasPrice?: number | string | BN;
  data?: string;
  nonce?: number;
}

export interface EventFilter {
  fromBlock?: number | string; // "latest" (default), "pending", blocknum
  toBlock?: number | string;
  address?: string | string[];
  topics?: any[];
}
