import React, { useEffect, useState } from 'react'
import { useDecimalAndDisplayFormat } from '../utils'

export const Reducer = ({ element, returnValueName, args, decimals, display, contractInstance, signature, web3 }) => {
  const [ returnValue, setReturnValue ] = useState(null)

  useEffect(() => {
    (async () => {
      let value
      try {
        if (args) {
          value = await contractInstance.methods[signature](...args).call()
        } else {
          value = await contractInstance.methods[signature]().call()
        }

        const newReturnValue = value?.[returnValueName] ?? value
        const formattedValue = useDecimalAndDisplayFormat(web3, newReturnValue, decimals, display)

        setReturnValue(formattedValue)
      } catch (error) {
        console.log('In Call Instance Error: ', error)
      }
    })()
  }, [])

  element.innerText = returnValue
  return null
}
