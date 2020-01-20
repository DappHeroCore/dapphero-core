import { logger } from 'logger/logger'
import { useState, useEffect } from 'react'

// retVal param needed in case of function w/ multiple possible return values

/**
 * This function is a react hook that automatically calls static view functions which have no arguements.
 * @param instance {object} this is the web3 contract instance.
 * @param signature {string} this is the signature of the method on the instance that we are calling.
 * @param identifiedReturnValue // TODO: I don't know what this is supopsed to be. explain?
 */
function useGetStaticFunc(instance: any, signature: any, identifiedReturnValue?: string | null) {
  const [ value, setValue ] = useState(null)

  useEffect(() => {
    async function getValue() {
      try {
        const signatureValue = await instance.methods[signature]().call()
        const returnedValued = identifiedReturnValue ? signatureValue[identifiedReturnValue] : signatureValue
        setValue(returnedValued)
      } catch (error) {
        console.log('The Function View Static error: ', error)
      }
    }
    getValue()
  }, [])

  return value
}

export { useGetStaticFunc }
