import { useState, useEffect } from 'react'
import { Web3Provider } from 'ethers/providers'
import { logger } from '../../logger/customLogger'
import { useInterval } from '../../utils/useInterval'

export const useMetamask = (polling) => {
  const [ metamask, setMetamask ] = useState({
    provider: null,
    chainId: null,
    isEnabled: false,
    enable: null,
    address: null,
  })
  useInterval(() => {
    const fetchMetamask = async () => {
      if (window.ethereum || window.web3) {
        try {
          const provider = new Web3Provider(window.ethereum || window.web3)
          const ready = await provider.ready
          const signer = provider.getSigner()
          let address = null
          try {
            address = await signer.getAddress()
          } catch (q) {
            // do nothing we aren't ready
          }
          const isEnabled = Boolean(address)
          logger.log(`Metamask is enabled, address: ${address}`)
          setMetamask({ provider, chainId: ready.chainId, address, isEnabled, enable: window.ethereum.enable || window.web3.enable })
        } catch (err) {
          logger.log(`Attempt to connect to Metamask failed with error: ${err}`)
        }
      }
    }
    fetchMetamask()
  }, polling)

  return metamask
}
