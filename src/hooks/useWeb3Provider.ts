import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useInterval } from 'beautiful-react-hooks'
import { logger } from '../logger/customLogger'
import { providerSchema } from '../consts'

export const useWeb3Provider = (polling, web3provider = null, providerTypeName = null) => {
  const [ ethereum, setEthereum ] = useState(providerSchema.providerSchema)
  const [ details, setDetails ] = useState<any>({ address: null, chainId: null })

  // If no providers return early the provider schema with all null values
  if (!web3provider && !window.ethereum && !window.web3?.currentProvider) return providerSchema.providerSchema
  const provider = web3provider || new ethers.providers.Web3Provider(window.ethereum || window?.web3?.currentProvider, 'any')

  provider.on('network', (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
      window.location.reload()
    }
  })

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

  // This will probably go....
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
        // const provider = web3provider || new ethers.providers.Web3Provider(window.ethereum || window?.web3?.currentProvider)
        const ready = await provider.ready
        const signer = provider?.getSigner ? provider.getSigner() : null
        let address = null
        if (signer?.getAddress) {
          const getCustomAddress = async () => {
            try {
              const signerAddress = await signer.getAddress()
              return signerAddress
            } catch (error) {
              // TODO: [DEV-294] Make a note in State that there is no assigned address
              return ''
            }
          }
          address = await getCustomAddress()
        }
        const { chainId } = ready
        if (address !== details.address || chainId !== details.chainId) {
          setDetails({ address, chainId, isEnabled: Boolean(address) })
        }
      } catch (error) {
        console.log('Polling did not work in useWeb3Provider.', error)
        setDetails({ address: null })
      }

    }

    if (provider?.getSigner) {
      poll()
    }

  }, polling)

  // If the provider doesn't have an address (a wallet attached), just return ethereum
  if (!details.address) return ethereum

  return { ...ethereum, ...details }
}

