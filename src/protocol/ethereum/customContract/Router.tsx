import React, { useState, useEffect, useContext } from 'react'

import * as contexts from 'contexts'
import * as consts from 'consts'
import { ethers, logger } from 'ethers'
import { useWeb3Provider } from 'hooks'

import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'

import { Reducer as CustomContractReducer } from './Reducer'

type ContractMethod = {
  id: string;
}

type ListOfContractMethods = ContractMethod[];

type Contract = any;

type RouterProps = {
  listOfContractMethods: ListOfContractMethods;
  contract: Contract;
  timestamp: number;
}

export const Router: React.FunctionComponent<RouterProps> = ({ listOfContractMethods, contract, timestamp }) => {

  const ethereum = useContext(contexts.EthereumContext)
  const { signer, isEnabled: writeEnabled, chainId: writeChainId, provider } = ethereum
  const { contractAddress, contractAbi, networkId } = contract

  const [ writeContract, setWriteContract ] = useState(null)

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Get the Network for our Project
  const contractNetwork = consts.global.ethNetworkName[networkId].toLowerCase()

  const stableReadProvider = new ethers.providers.JsonRpcProvider(consts.providerSchema.readProviders[contractNetwork].http)

  // TODO: [DEV-340] Mainnet will always load backend provider because ethers calls it "homestead"
  const [ readContract, setReadContract ] = useState(null)
  useEffect(() => {
    const makeReadContract = (): void => {

      let readContractInstance = null
      // Make the contract instance from either the local provider or remote provider
      if (provider && contractNetwork === provider?._network?.name) {
        console.log('Using local provider for contract reads.')
        readContractInstance = new ethers.Contract(contractAddress, contractAbi, provider)
      } else {
        console.log('Using DH-backend provider for contract reads.')
        readContractInstance = new ethers.Contract(contractAddress, contractAbi, stableReadProvider)
      }
      readContractInstance.on('*', (data) => emitToEvent(
        EVENT_NAMES.contract.contractEvent,
        { value: data, step: 'Contract has emitted a Contract Event', status: EVENT_STATUS.resolved, methodNameKey: null },
      ))
      setReadContract(readContractInstance)
    }
    makeReadContract()
  }, [ ])

  useEffect(() => {
    const makeWriteContract = (): void => {
      const writeContractInstance = new ethers.Contract(contractAddress, contractAbi, signer)
      setWriteContract(writeContractInstance)
    }

    // TODO: Check if we are on the same chainID as the Contract
    if (writeEnabled) makeWriteContract()
    // Else pop up information that we are not on the right network
  }, [ writeChainId, signer, writeEnabled ])

  // Set this on the window object
  useEffect(() => {
    if (!window?.dappHero) return
    Object.assign(window.dappHero.contracts, { [contractAddress]: { readContract, writeContract } })
  }, [ readContract, writeContract ])

  // If not read contract or provider, return early
  if (!readContract) return null

  return (
    <>
      {listOfContractMethods.map((contractMethodElement: { id: React.ReactText }) => (
        <CustomContractReducer
          readContract={readContract}
          readChainId={networkId}
          writeContract={writeContract}
          readEnabled={Boolean(readContract)}
          writeEnabled={writeEnabled}
          info={contractMethodElement}
          key={contractMethodElement.id}
          timestamp={timestamp}
          contractAbi={contractAbi}
        />
      ))}
    </>
  )

}
