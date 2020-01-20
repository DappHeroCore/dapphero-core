import React, { FunctionComponent, useEffect, useState } from 'react'
import * as api from 'api'
import { useWeb3Injected } from '@openzeppelin/network/react'
interface NftSingleContainerProps {
  element: HTMLElement
}

export const NftSingleContainer: FunctionComponent<NftSingleContainerProps> = ({ element }) => {
  const contractMatch = element.id.match(/-contract_([a-zA-z0-9]+)/)
  const contractAddress = contractMatch?.[1] ? contractMatch[1] : null
  const tokenMatch = element.id.match(/-tokenId_([a-zA-z0-9]+)/)
  const tokenId = tokenMatch?.[1] ? tokenMatch[1] : null
  const { lib: { currentProvider }, networkName, connected } = useWeb3Injected()

  const [ responseObj, setResponseObj ] = useState({})

  useEffect(() => {
    const getData = async () => {
      if (contractAddress && tokenId) {
        const response = await api.openSea.retrieveAsset({ contractAddress, tokenId })
        console.log('response', response)
        setResponseObj(response)
      }
    }
    if (connected) getData()
  }, [ connected, currentProvider, networkName ])

  return null
}

