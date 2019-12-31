import {useEffect, useState} from "react"

//This function returns to us a contract instance. 
//It requires an abi, and instance of web3 and an address of where
//the contract is deployed. It is not aware of the network it is deployed on.
export const useGetContractInstance: any = (abi, address, web3) => {
    const [instance, setInstance] = useState(null)
  
    useEffect(() => {
      function createInstance(abi, address, web3) {
        const instance = new web3.eth.Contract(abi, address)
        setInstance(instance)
      }
      createInstance(abi, address, web3)
    }, [])
    return instance
  }