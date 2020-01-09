import { useState, useEffect } from 'react'

// retVal param needed in case of function w/ multiple possible return values
function useGetStaticFunc(instance: any, signature: any, identifiedReturnValue?: string | null) {
  const [ value, setValue ] = useState(null)

  useEffect(() => {
    async function getValue() {
      let value
      try {
        value = await instance.methods[signature]().call()
        value = identifiedReturnValue ? value[identifiedReturnValue] : value
      } catch (error) {
        console.log('The Function View Static error: ', error)
      }
      setValue(value)
    }
    getValue()
  }, [])

  return value
}

export { useGetStaticFunc }
