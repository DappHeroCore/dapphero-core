import { useState, useEffect } from 'react'

export const useWeb3Test = () => {
  // hardcoded
  // export const web3ReactContext = {
  //   library: {},
  //   chainId: 1234,
  //   account: '0x8f8hd87sj',
  //   netWor
  //   networkName: { networkName: 'dappherotestnet' },
  //   connected: false,
  // }
  // const { library, chainId, account, active } = web3ReactContext

  const [ context, setContext ] = useState({
    // web3ReactContext,
    // lib: null,
    // accounts: [],
    networkId: null,
    // networkName: { network: null },
    // connected: false,
  })

  useEffect(() => {
    setContext({
      // web3ReactContext: {},
      // lib: {},
      // accounts: [ account ],
      networkId: 'dappherotest',
      // networkName: library?.network?.name ?? null,
      // connected: active,
    })
  }, [ ]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag

  return context
}
