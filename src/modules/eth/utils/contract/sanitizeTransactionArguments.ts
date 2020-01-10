import Web3 from 'web3' //eslint-disable-line
import { asciiToHex } from '../../../../api/ethereum'

enum MethodTypes {
  STRING = 'string',
  BYTES32 = 'bytes32'
}

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
