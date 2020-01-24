import { useState, useEffect } from 'react'

/**
 *
 * @param abi {object} this is the contract abi and required to create a contract instance
 * @param address {string} this is the address where a contract is deployed on the ethereum network
 * @param web3 {object} this is the web3 object which provides us the ability to create a contract instance.
 * @returns {object} this is the instance of the contract
 */
function useContractInstance(abi, address, web3) {
  return new web3.eth.Contract(abi, address)
}

export { useContractInstance }
