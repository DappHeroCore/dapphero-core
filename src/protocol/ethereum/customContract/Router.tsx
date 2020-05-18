import React, { useState, useEffect, useContext } from 'react'

import * as contexts from 'contexts'
import * as consts from 'consts'
import { ethers } from 'ethers'
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
  retriggerEngine: () => void;
  timeStamp: number;
}

export const Router = ({ listOfContractMethods, contract, retriggerEngine, timeStamp }: RouterProps) => {

  const ethereum = useContext(contexts.EthereumContext)
  const { signer, isEnabled: writeEnabled, chainId: writeChainId } = ethereum
  const { contractAddress, contractAbi, networkId } = contract

  const [ readContract, setReadContract ] = useState(null)
  const [ writeContract, setWriteContract ] = useState(null)

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Set this on the window object
  useEffect(() => {

    if (!window?.dappHero) return

    Object.assign(window.dappHero.contracts, { [contractAddress]: { readContract, writeContract } })
  }, [ readContract, writeContract ])

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
      readContractInstance.on('*', (data) => emitToEvent(
        EVENT_NAMES.contract.contractEvent,
        { value: data, step: 'Contract has emitted a Contract Event', status: EVENT_STATUS.resolved, methodNameKey: null },
      ))
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
  }, [ writeChainId, signer, writeEnabled ])

  // If the read contract provider isnt ready return early
  if (!readEnabled) return null

  return (
    <>
      {listOfContractMethods.map((contractMethodElement: { id: React.ReactText }) => (
        <CustomContractReducer
          readContract={readContract}
          readChainId={readChainId}
          writeContract={writeContract}
          readEnabled={readEnabled}
          writeEnabled={writeEnabled}
          info={contractMethodElement}
          key={contractMethodElement.id}
          timeStamp={timeStamp}
        />
      ))}
    </>
  )

}
