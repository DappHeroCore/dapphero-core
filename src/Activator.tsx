import React, { useContext, useEffect, useState } from 'react'

import * as consts from 'consts'
import * as contexts from 'contexts'
import { loggerTest } from 'logger/loggerTest'

import { EVENT_NAMES } from 'providers/EmitterProvider/constants'
import { EmitterContext } from 'providers/EmitterProvider/context'

import { FeatureReducer } from './protocol/ethereum/featureReducer'

import { highlightDomElements } from './utils/highlightDomElements'

import { openSeaApi as nftApi } from './protocol/ethereum/nft/api'

// Log tests and Startup Logs
loggerTest()

// TODO: Type configuration
type ActivatorProps = {
  configuration: any;
  domElements: any;
  setConfig: any;
  supportedNetworks: any;
  retriggerEngine: () => void;
  timeStamp: any;
  contractElements: any;
  domElementsFilteredForContracts: any;
  db: any;
}

export const Activator: React.FC<ActivatorProps> = ({
  configuration,
  retriggerEngine,
  timeStamp,
  domElements,
  setConfig,
  supportedNetworks,
  contractElements,
  domElementsFilteredForContracts,
  db,
}: ActivatorProps) => {

  // Ethereum
  const ethereum = useContext(contexts.EthereumContext)

  // TODO: [DEV-248] We should make this an app level state later.
  const AppReady = true

  const { actions: { listenToEvent } } = useContext(EmitterContext)

  // Allow users to add contracts using Javascript
  const addClientSideContract = ({ contractName, contractAddress, contractAbi, networkId }) => {
    const existingContracts = configuration.contracts
    setConfig({ contracts: [ ...existingContracts, { contractName, contractAddress, contractAbi, networkId } ] })
  }

  useEffect(() => {
    const dappHero = {
      debug: false,
      enabled: ethereum.isEnabled,
      highlightEnabled: false,
      domElements,
      configuration,
      collectibles: { nftApi },
      contracts: {},
      addClientSideContract,
      retriggerEngine,
      projectId: consts.global.apiKey,
      provider: ethereum,
      db,
      toggleHighlight(): void {
        dappHero.highlightEnabled = !dappHero.highlightEnabled
        highlightDomElements(dappHero.highlightEnabled, domElements)
      },
      listenToContractOutputChange: (cb): void => listenToEvent(EVENT_NAMES.contract.outputUpdated, cb),
      listenToContractAutoInvokeChange: (cb): void => listenToEvent(EVENT_NAMES.contract.autoInvoke, cb),
      listenToTransactionStatusChange: (cb): void => listenToEvent(EVENT_NAMES.contract.statusChange, cb),
      listenToContractInvokeTriggerChange: (cb): void => listenToEvent(EVENT_NAMES.contract.invokeTrigger, cb),
      listenToSmartContractBlockchainEvent: (cb): void => listenToEvent(EVENT_NAMES.contract.contractEvent, cb),
      listenToUserAddressChange: (cb): void => listenToEvent(EVENT_NAMES.user.addressStatusChange, cb),
      listenToUserBalanceChange: (cb): void => listenToEvent(EVENT_NAMES.user.balanceStatusChange, cb),
      listenToNFTLoadSingleToken: (cb): void => listenToEvent(EVENT_NAMES.nft.loadSingleToken, cb),
      listenToNFTLoadMultipleToken: (cb): void => listenToEvent(EVENT_NAMES.nft.loadMultipleTokens, cb),
      listenToNFTLoadAllToken: (cb): void => listenToEvent(EVENT_NAMES.nft.loadAllTokens, cb),
      listenTo3BoxProfile: (cb): void => listenToEvent(EVENT_NAMES.threeBox.loadProfile, cb),
      listenToEthTransfer: (cb): void => listenToEvent(EVENT_NAMES.ethTransfer.sendEther, cb),
    }
    Object.assign(window, { dappHero })

    // Dispatch the event.
    const event = new CustomEvent('dappHeroConfigLoaded', { detail: dappHero })
    document.dispatchEvent(event)
  }, [ AppReady, ethereum.isEnabled ])

  if (!AppReady || !domElementsFilteredForContracts) return null
  return (
    <>
      {domElementsFilteredForContracts
          && domElementsFilteredForContracts.map((domElement) => (
            <FeatureReducer
              key={domElement.id}
              domElements={domElements}
              element={domElement.element}
              feature={domElement.feature}
              configuration={configuration}
              info={domElement}
              customContractElements={contractElements}
              retriggerEngine={retriggerEngine}
              timeStamp={timeStamp}
            />
          ))}
    </>
  )

}
