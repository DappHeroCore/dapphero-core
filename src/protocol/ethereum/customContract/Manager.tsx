import React, { useEffect, useState, useContext } from 'react'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { getDomElements } from '@dapphero/dapphero-dom'
import { Router as CustomContractRouter } from './Router'

export type ManagerProps = {
    customContractElements?: any;
    configuration?: any;
  }

export const Manager: React.FunctionComponent<ManagerProps> = ({ customContractElements, configuration }) => {

  const { actions: { emitToEvent, listenToEvent } } = useContext(EmitterContext)

  const uniqueContractNames = new Set([ ...customContractElements.map(({ contract }) => contract.contractName) ])

  const [ timestamp, setTimestamp ] = useState(Date.now())
  useEffect(() => {
    listenToEvent('nftsUpdated', setTimestamp);
  }, [])

  for (const contractName of uniqueContractNames) {

    const domElements2 = getDomElements(configuration)
    console.log('domElements2', domElements2)
    const contractElements = domElements2.filter((element) => element.feature === 'customContract')
    const methodsByContractAsElements = contractElements.filter((element) => element.contract.contractName === contractName)
    const contract = configuration.contracts.filter((thisContract) => (thisContract.contractName === contractName))[0]

    return (
      <CustomContractRouter
        listOfContractMethods={methodsByContractAsElements}
        contract={contract}
        timestamp={timestamp}
      />
    )
  }
}
