import { useState, useEffect } from 'react'
import { Web3Provider } from 'ethers/providers'
import { logger } from '../../logger/customLogger'
import { useInterval } from '../../utils/useInterval'
import { providerSchema } from '../../consts'

export const useWeb3Provider = (polling) => {
  const [ metamask, setMetamask ] = useState(providerSchema)
  const provider = new Web3Provider(window.ethereum || window.web3)

  useInterval(() => {
    const fetchMetamask = async () => {
      if (window.ethereum || window.web3) {
        try {
          const ready = await provider.ready
          const signer = provider.getSigner()
          let address = null
          try {
            address = await signer.getAddress()
          } catch (q) {
            // do nothing we aren't ready
          }
          const isEnabled = Boolean(address)
          const providerType = (window.ethereum.isMetaMask || window.web3.isMetaMask) ? 'metamask' : 'unknown provider'
          setMetamask({ provider, providerType, signer, chainId: ready.chainId, address, isEnabled, networkName: (ready.name === 'homestead') ? 'mainnet' : ready.name, enable: window.ethereum.enable || window.web3.enable })
        } catch (err) {
          logger.log(`Attempt to connect to Metamask failed with error: ${err}`)
        }
      }
    }
    fetchMetamask()
  }, polling)

  return metamask
}
