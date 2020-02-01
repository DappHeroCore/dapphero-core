import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

export const useDappHeroWeb3 = () => {
  const web3ReactContext = useWeb3React()
  const { library, chainId, account, active } = web3ReactContext

  const [ context, setContext ] = useState({
    web3ReactContext,
    lib: null,
    accounts: [],
    networkId: null,
    networkName: null,
    connected: false,
  })

  useEffect(() => {
    setContext({
      web3ReactContext,
      lib: library,
      accounts: [ account ],
      networkId: chainId,
      networkName: library?.network?.name || "This dog don't hunt. Line 25 of useDappHeroWeb3.ts",
      connected: active,
    })
  }, [ library, chainId, account ]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag

  return context
}
