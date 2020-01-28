import { logger } from 'logger/customLogger'
import { useEffect } from 'react'

// TODO: Is this a custom hook and therefore should follow React hooks format?
// IE: it shoudl start with "useCallPublicMethodWithArgs"

/**
 * This function calls a public Ethereum contract method with a provided array of Arguments.
 * @param instance {object} the web3 contract instance.
 * @param signature {string} the signature of the method that is being called.
 * @param args {array} arguments to be passed to the method
 * @param callback {function} the callback to be run with the return value from the method.
 * This is typically a "setState" function from higher up.
 * @param identifiedReturnValue {string} for methods that return multiple arguments, this will return only the
 * requested argument.
 * TODO: verify that the above assumption is the case.
 */
export const callPublicMethodWithArgs = async (
  injected,
  instance,
  signature,
  args: any[],
  callback,
  identifiedReturnValue: string | undefined,
) => {
  try {
    let value = await instance.methods[signature](...args).call()
    if (typeof value === 'string') { // single return value from func
      callback(value)
    } else {
      value = identifiedReturnValue ? value[identifiedReturnValue] : value
      callback(value)
    }
  } catch (e) {
    logger.debug('In Call Instance Error: ', e)
  }
}
