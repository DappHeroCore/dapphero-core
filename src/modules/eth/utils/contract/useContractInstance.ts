import { useState, useEffect } from 'react'

function useContractInstance(abi, address, web3) {
  const [ instance, setInstance ] = useState(null)

  useEffect(() => {
    (() => {
      const contractInstance = new web3.eth.Contract(abi, address)
      setInstance(contractInstance)
    })()
  }, [])
  return instance
}

export { useContractInstance }
