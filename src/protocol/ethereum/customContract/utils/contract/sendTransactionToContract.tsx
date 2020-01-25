
import Notify from 'bnc-notify'
import Web3Utils from 'web3-utils'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
const useBlockNative = true

enum MethodTypes {
  STRING = 'string',
  BYTES32 = 'bytes32'
}

export const sendTransactionToContract: any = (
  instance, // The instance of the Contract
  signature, // The Signatuer of the method being invoked
  args, // An array of arguments to be provided if required.
  account, // accounts[0] of the person calling it
  setTxState, // These two areguments are the current state of a tx object in a functional component
  method,
  networkId,
  value?: string,

) => {
  const notify = Notify({
    dappId: apiKey, // [String] The API key created by step one above
    networkId, // [Integer] The Ethereum network ID your Dapp uses.
  })

  const from = Web3Utils.toChecksumAddress(account)

  const sanitizedArgs = args.map((arg, i) => {
    if (
      typeof arg === MethodTypes.STRING
      && method.inputs[i].type === MethodTypes.BYTES32
    ) {
      return Web3Utils.asciiToHex(arg)
    }
    return arg
  })

  // TODO: [DEV-112] Nesseity to set gas and gasprice!!!!!!
  instance.methods[signature](...sanitizedArgs)
    .send({
      from,
      value: value ? Web3Utils.toWei(value) : null, // if value? arg, convert to wei. if no arg => send null
    })
    .on('transactionHash', (hash) => {
      useBlockNative ? notify.hash(hash) : null // TODO: We should set this on the config tool, but enable by default, we can be opinionated.
      setTxState((newTxState) => ({ ...newTxState, transactionHash: hash }))
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      setTxState((newTxState) => ({
        ...newTxState,
        confirmations: confirmationNumber,
        receipt,
      }))
    })
    .on('receipt', (receipt) => {
      setTxState((newTxState) => ({
        ...newTxState,
        receipt,
      }))
    })
    .on('error', (error, receipt) => {
      setTxState((newTxState) => ({
        ...newTxState,
        error,
        receipt,
      }))
    })
}

