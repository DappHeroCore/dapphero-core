import Web3 from 'web3';

const web3 = new Web3(); // Needs more parameters

export const getBalance = async (address: string): Promise<string> => new Promise((resolve, reject) => {
  web3.eth.getBalance(address)
    .then((balance) => resolve(balance))
    .catch((err) => reject(err));
});
