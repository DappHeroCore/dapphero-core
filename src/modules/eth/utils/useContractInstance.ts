import { useState, useEffect } from 'react'

export function useContractInstance(abi: any, address: any, web3: any) {
  const [ instance, setInstance ] = useState(null)

  useEffect(() => {
    setInstance(new web3.eth.Contract(abi, address))
  }, [])

  return instance
}
