import React, { useState, useEffect, useContext, useCallback } from 'react'

import * as contexts from 'contexts'
import * as consts from 'consts'
import { ethers } from 'ethers'
import { useWeb3Provider } from 'providers/ethereum/useWeb3Provider'

import { Reducer as CustomContractReducer } from './Reducer'

type ContractMethod = {
  id: string;
}

type ListOfContractMethods = ContractMethods[];

type Contract = any;

type RouterProps = {
  listOfContractMethods: ListOfContractMethods;
  contract: Contract;
}

export const Router = ({ listOfContractMethods, contract }: RouterProps) => {

  const ethereum = useContext(contexts.EthereumContext)
  const { signer, isEnabled: writeEnabled, chainId } = ethereum
  const { contractAddress, contractAbi, networkId } = contract

  const [ readContract, setReadContract ] = useState(null)
  const [ writeContract, setWriteContract ] = useState(null)

  // WE CAN CHECK HERE IF WE ARE ON THE RIGHT NETWORK WITH THE PROVIDER
  const contractNetwork = consts.global.ethNetworkName[networkId].toLowerCase()

  // Create the Read Provider
  const { provider: readOnlyProvider, chainId: readChainId, isEnabled: readEnabled } = useWeb3Provider(
    consts.global.POLLING_INTERVAL,
    ethers.getDefaultProvider(contractNetwork),
    `dh-${contractNetwork}`,
  )

  useEffect(() => {
    const makeReadContract = (): void => {
      const readContractInstance = new ethers.Contract(contractAddress, contractAbi, readOnlyProvider)
      setReadContract(readContractInstance)
    }

    // TODO: Check if we are on the right ChainId for the contract
    if (readOnlyProvider) makeReadContract()
  }, [ readEnabled, readChainId ])

  useEffect(() => {
    const makeWriteContract = (): void => {
      const writeContractInstance = new ethers.Contract(contractAddress, contractAbi, signer)
      setWriteContract(writeContractInstance)
    }

    // TODO: Check if we are on the same chainID as the Contract
    if (writeEnabled) makeWriteContract()
  }, [ chainId, signer, writeEnabled ])

  // If the read contract provider isnt ready return early
  if (!readEnabled) return null

  return (
    <>
      {listOfContractMethods.map((contractMethodElement: { id: React.ReactText }) => (
        <CustomContractReducer
          readContract={readContract}
          writeContract={writeContract}
          readEnabled={readEnabled}
          writeEnabled={writeEnabled}
          info={contractMethodElement}
          key={contractMethodElement.id}
        />
      ))}
    </>
  )

}
