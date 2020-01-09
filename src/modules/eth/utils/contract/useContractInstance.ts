import { useState, useEffect } from 'react'

function useContractInstance(abi, address, web3) {
  const [ instance, setInstance ] = useState(null)

  useEffect(() => {
    function createInstance(abi, address, web3) {
      const instance = new web3.eth.Contract(abi, address)
      setInstance(instance)
    }
    createInstance(abi, address, web3)
  }, [])
  return instance
}

export { useContractInstance }
