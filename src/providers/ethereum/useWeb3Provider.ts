import { useState, useEffect } from 'react'
import { Web3Provider } from 'ethers/providers'
import { logger } from '../../logger/customLogger'
import { useInterval } from '../../utils/useInterval'
import { providerSchema } from '../../consts'

export const useWeb3Provider = (polling, web3provider, providerTypeName) => {
  const [ metamask, setMetamask ] = useState(providerSchema)
  const provider = web3provider || new Web3Provider(window.ethereum || window.web3) // What if there is no injected either?

  useInterval(() => {
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
          const providerType = (window.ethereum.isMetaMask || window.web3.isMetaMask ) && !web3provider ? 'metamask' : 'unknown provider'
          setMetamask({ provider, providerType: providerTypeName || providerType, signer, chainId: ready.chainId, address, isEnabled, networkName: (ready.name === 'homestead') ? 'mainnet' : ready.name, enable: window.ethereum.enable || window.web3.enable })
        } catch (err) {
          logger.log(`Attempt to connect to Metamask failed with error: ${err}`)
        }
      }
    }
    if (provider) fetchMetamask()

  }, polling)
  return metamask
}
