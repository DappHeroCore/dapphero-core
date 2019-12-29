import Web3 from 'web3';

export const getBalance = (address: string, web3Instance: Web3): Promise<string> => {
  return web3Instance.eth.getBalance(address)
};
