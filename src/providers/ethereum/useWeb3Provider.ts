import { useState, useEffect } from 'react'
import { Web3Provider } from 'ethers/providers'
import { addListener } from 'cluster'
import { logger } from '../../logger/customLogger'
import { useInterval } from '../../utils/useInterval'
import { providerSchema } from '../../consts'

export const useWeb3Provider = (polling, web3provider = null, providerTypeName = null) => {
  const [ ethereum, setEthereum ] = useState(providerSchema.providerSchema)
  const [ details, setDetails ] = useState({ address: null, chainId: null })

  // If no providers return early the provider schema with all null values
  if (!web3provider && !window.ethereum && !window.web3?.currentProvider) return providerSchema.providerSchema
  const provider = web3provider || new Web3Provider(window.ethereum || window?.web3?.currentProvider)

  // find the provider type
  let providerType

  if (providerTypeName) {
    providerType = providerTypeName
  } else if (window.ethereum.isMetaMask && !web3provider) {
    providerType = 'metamask'
  } else if (window.web3?.currentProvider?.isToshi) {
    providerType = 'toshi'
  } else {
    providerType = 'unknown'
  }

  useEffect(() => {
    const fetchMetamask = async () => {
      if (window.ethereum || window.web3) {
        try {
          const ready = await provider.ready
          let signer = null
          let address = null
          try {
            signer = provider.getSigner()
            address = await signer.getAddress()
          } catch (q) {
            // do nothing we aren't ready or there is no signer attached
          }
          const isEnabled = Boolean(window.ethereum.selectedAddress) || false

          setEthereum({ provider, providerType, signer, chainId: ready.chainId, address, isEnabled, networkName: (ready.name === 'homestead') ? 'mainnet' : ready.name, enable: window.ethereum.enable || window.web3.enable })
        } catch (err) {
          logger.log(`Attempt to connect to Metamask failed with error: ${err}`)
        }
      }
    }
    if (provider) fetchMetamask()
  }, [ details ])

  // Load a read provider
  useEffect(() => {
    const loadReadProvider = async () => {
      try {
        const ready = await provider.ready
        setEthereum({ provider, providerType, signer: null, chainId: ready.chainId, address: null, isEnabled: Boolean(ready.chainId), networkName: ready.name, enable: null })
      } catch (err) {
        logger.log(`Attempt to connect to Metamask failed with error: ${err}`)
      }
    }
    if (web3provider) loadReadProvider()
  }, [])

  // Poll a write provider
  useInterval(() => {
    const poll = async () => {
      try {
        const provider = web3provider || new Web3Provider(window.ethereum || window?.web3?.currentProvider)
        const ready = await provider.ready
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const { chainId } = ready
        if (address !== details.address || chainId !== details.chainId) {
          setDetails({ address, chainId })
        }
      } catch (error) {
        logger.log('Polling did not work in useWeb3Provider.', error)
      }

    }

    if (provider?.getSigner) {
      poll()
    }
  }, 500) // TODO: Set back to consts file

  // If
  if (!details.address) return ethereum

  return { ...ethereum, ...details }
}

