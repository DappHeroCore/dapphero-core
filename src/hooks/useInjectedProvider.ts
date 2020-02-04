import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export const useInjectedProvider = () => {
  const [ web3Provider, setWeb3Provider ] = useState(null)

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      setWeb3Provider({
        providerName: window.ethereum?.isMetaMask ? 'metamask' : 'unknown',
        provider,
        networkName: provider?.network?.name,
        chainId: provider?.network?.chainId,
        enable: window.ethereum.enable,
        signer,
        currentDate: new Date().toString(),
        account: signer.getAddress(),
      })
    }

  }, [ window.ethereum?.chainId, window.ethereum?.selectedAddress ])

  return web3Provider
}
