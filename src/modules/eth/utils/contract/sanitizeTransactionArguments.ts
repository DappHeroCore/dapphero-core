import Web3 from 'web3' //eslint-disable-line
import { asciiToHex } from '../../../../api/ethereum'

enum MethodTypes {
  STRING = 'string',
  BYTES32 = 'bytes32'
}

// TODO: Is this really santizing arguments or is it properlly converting from string to bytes32?
/**
 * This function does what exactly? santize arguments or convert arguments?
 * @param args {array} array of arguments for a function method
 * @param method {object} an object representing a method. On this method are our inputs and their types.
 * @param injected {object} a web3 object.
 */
export const sanitizeTransactionArguments = (
  args: any[],
  method: any,
  injected: Web3
) => {
  const sanitizedArgs = args.map((arg, i) => {
    if (
      typeof arg === MethodTypes.STRING
      && method.inputs[i].type === MethodTypes.BYTES32
    ) {
      return asciiToHex(injected, arg)
    }

    return arg
  })

  return sanitizedArgs
}
