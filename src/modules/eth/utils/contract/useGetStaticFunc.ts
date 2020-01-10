import { useState, useEffect } from 'react'

// retVal param needed in case of function w/ multiple possible return values
function useGetStaticFunc(instance: any, signature: any, identifiedReturnValue?: string | null) {
  const [ value, setValue ] = useState(null)

  useEffect(() => {
    async function getValue() {
      try {
        const signatureValue = await instance.methods[signature]().call()
        const value = identifiedReturnValue ? signatureValue[identifiedReturnValue] : signatureValue
        setValue(value)
      } catch (error) {
        console.log('The Function View Static error: ', error)
      }
    }
    getValue()
  }, [])

  return value
}

export { useGetStaticFunc }
