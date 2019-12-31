import { useState, useEffect } from 'react'

//When provided a contract instance, and a Signature for the method being called,
//It will properlly return the from the value from the method call
export const useGetValueFromPublicMethodNoArgs: any = (instance, signature) => {
  const [value, setValue] = useState(null)

  useEffect(() => {
    async function getValue() {
      let value
      try {
        value = await instance.methods[signature]().call()
      } catch (error) {
        console.log('The Function View Static error: ', error)
      }
      setValue(value)
    }
    getValue()
  }, [])

  return value
}

