import React, { useState, useEffect, useContext, useCallback } from 'react'

import * as contexts from 'contexts'
import * as consts from 'consts'
import { ethers } from 'ethers'
import { useWeb3Provider } from 'providers/ethereum/useWeb3Provider'

import { Reducer as CustomContractReducer } from './Reducer'

const POLLING_INTERVAL = 4000

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
  const { signer, isEnabled, chainId } = ethereum
  const { contractAddress, contractAbi, networkId } = contract

  const [ readContract, setReadContract ] = useState(null)
  const [ writeContract, setWriteContract ] = useState(null)

  // WE CAN CHECK HERE IF WE ARE ON THE RIGHT NETWORK WITH THE PROVIDER
  const contractNetwork = consts.global.ethNetworkName[networkId].toLowerCase()

  // Create the Read Provider
  const { provider: readOnlyProvider, chainId: readChainId } = useWeb3Provider(
    POLLING_INTERVAL,
    ethers.getDefaultProvider(contractNetwork),
    `dh-${contractNetwork}`,
  )

  useEffect(() => {
    const makeReadOnlyContract = () => {
      const readOnlyContract = new ethers.Contract(contractAddress, contractAbi, readOnlyProvider)
      setReadContract(readOnlyContract)
    }
    if (readOnlyProvider) makeReadOnlyContract()
  }, [ readChainId ])

  // Create a write Provider from the injected ethereum context
  // Here we can check if were on the right network or not

  useEffect(() => {
    const makeWriteContract = () => {
      const instance = new ethers.Contract(contractAddress, contractAbi, signer)
      setWriteContract(instance)
    }

    if (isEnabled) makeWriteContract()
  }, [ chainId, signer, isEnabled ])

  return (
    <>
      {listOfContractMethods.map((contractMethodElement: { id: React.ReactText }) => (
        <CustomContractReducer
          readContract={readContract}
          writeContract={writeContract}
          info={contractMethodElement}
          key={contractMethodElement.id}
        />
      ))}
    </>
  )

}
