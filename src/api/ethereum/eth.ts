import Web3 from "web3";
import { TransactionObject, EventFilter } from "./types";

// find cleaner type return value
export const currentProvider = (
  web3Instance: Web3
): Web3["currentProvider"] => {
  return web3Instance.eth.currentProvider;
};

// find cleaner type return value
export const givenProvider = (web3Instance: Web3): Web3["givenProvider"] => {
  return web3Instance.eth.givenProvider;
};

export const defaultAccount = (web3Instance: Web3): string | null => {
  return web3Instance.eth.defaultAccount;
};

export const getGasPrice = (web3Instance: Web3): Promise<String> => {
  return web3Instance.eth.getGasPrice();
};

export const getAccounts = (web3Instance: Web3): Promise<String[]> => {
  return web3Instance.eth.getAccounts();
};

export const getBlockNumber = (web3Instance: Web3): Promise<Number> => {
  return web3Instance.eth.getBlockNumber();
};

export const getBalance = (
  address: string,
  web3Instance: Web3
): Promise<string> => {
  return web3Instance.eth.getBalance(address);
};

// necessary?
export const getStorageAt = (
  address: string,
  defaultBlock: number,
  web3Instance: Web3
): Promise<string> => {
  return web3Instance.eth.getStorageAt(address, defaultBlock);
};

// necessary?
export const getCode = (
  address: string,
  defaultBlock: number,
  web3Instance: Web3
): Promise<string> => {
  return web3Instance.eth.getCode(address, defaultBlock);
};

// find block return type
export const getBlock = (
  blockHashOrBlockNumber: string,
  web3Instance: Web3
): Promise<any> => {
  return web3Instance.eth.getBlock(blockHashOrBlockNumber);
};

export const getBlockTransactionCount = (
  blockHashOrBlockNumber: string,
  web3Instance: Web3
): Promise<number> => {
  return web3Instance.eth.getBlockTransactionCount(blockHashOrBlockNumber);
};

// find tx return type
export const getTransaction = (
  transactionHash: string,
  web3Instance: Web3
): Promise<any> => {
  return web3Instance.eth.getTransaction(transactionHash);
};

// find tx return type
export const getTransactionFromBlock = (
  hashStringOrNumber: string | number,
  indexNumber: number,
  web3Instance: Web3
): Promise<any> => {
  return web3Instance.eth.getTransactionFromBlock(
    hashStringOrNumber,
    indexNumber
  );
};

// find tx receipt type
export const getTransactionReceipt = (
  transactionHash: string,
  web3Instance: Web3
): Promise<any> => {
  return web3Instance.eth.getTransactionReceipt(transactionHash);
};

export const getTransactionCount = (
  address: string,
  web3Instance: Web3
): Promise<number> => {
  return web3Instance.eth.getTransactionCount(address);
};

// find tx receipt type
export const sendTransaction = (
  transactionObject: TransactionObject,
  web3Instance: Web3
): Promise<any> => {
  return web3Instance.eth.sendTransaction(transactionObject);
};

// add sendSignedTransaction?

export const sign = (
  data: string,
  address: string | number,
  web3Instance: Web3
): Promise<string> => {
  return web3Instance.eth.sign(data, address);
};

// find RLP encoded tx type
export const signTransaction = (
  transactionObject: TransactionObject,
  address: string,
  web3Instance: Web3
): Promise<any> => {
  return web3Instance.eth.signTransaction(transactionObject, address);
};

export const estimateGas = (
  transactionObject: TransactionObject,
  web3Instance: Web3
): Promise<number> => {
  return web3Instance.eth.estimateGas(transactionObject);
};

// find log object type
export const getPastLogs = (options: EventFilter, web3Instance: Web3): Promise<any[]> => {
  return web3Instance.eth.getPastLogs(options);
}

export const getChainId = (web3Instance: Web3): Promise<number> => {
  return web3Instance.eth.getChainId();
}