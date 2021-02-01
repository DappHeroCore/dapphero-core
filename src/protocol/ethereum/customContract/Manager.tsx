import React, { useEffect, useState, useContext } from 'react'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { getDomElements } from '@dapphero/dapphero-dom'
import { Router as CustomContractRouter } from './Router'

export type ManagerProps = {
    customContractElements?: any;
    configuration?: any;
  }

export const Manager: React.FunctionComponent<ManagerProps> = ({ customContractElements, configuration: appConfig }) => {

  const { actions: { listenToEvent } } = useContext(EmitterContext)

  const [ timestamp, setTimestamp ] = useState(Date.now())
  const [ configuration, setConfiguration ] = useState(appConfig)
  const [ uniqueContractNames, setUniqueContractNames ] = useState(new Set([ ...customContractElements.map(({ contract }) => contract.contractName) ]))

  useEffect(() => {
    listenToEvent('nftsUpdated', setTimestamp)
  }, [])

  // TODO: [DEV-318] Create a function to add a new contract name and add a new configuration

  // for (const contractName of uniqueContractNames)
  return (
    <>
      {Array.from(uniqueContractNames).map((contractName) => {
        const newDomElements = getDomElements(configuration)
        const contractElements = newDomElements.filter((element) => element.feature === 'customContract')
        const methodsByContractAsElements = contractElements.filter((element) => element.contract.contractName === contractName)
        const contract = configuration.contracts.filter((thisContract) => (thisContract.contractName === contractName))[0]
        const contractNetworkId = configuration.contracts.filter((thisContract) => (thisContract.contractName === contractName))[0].networkId

        return (
          <CustomContractRouter
            key={contractName}
            listOfContractMethods={methodsByContractAsElements}
            contract={contract}
            timestamp={timestamp}
            contractNetworkId={contractNetworkId}
          />
        )
      })}
    </>
  )
}
