import Web3 from 'web3' // eslint-disable-line
import Notify from 'bnc-notify'
import { sanitizeTransactionArguments } from '../index'
import { toChecksumAddress, toWei } from '../../../../api/ethereum'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
const useBlockNative = true

// This function will send an arbitary Transaction. It requires:
export const sendTransactionToContract: any = (
  injected: Web3,
  instance, // The instance of the Contract
  signature, // The Signatuer of the method being invoked
  args, // An array of arguments to be provided if required.
  accounts, // accounts[0] of the person calling it
  setTxState, // These two areguments are the current state of a tx object in a functional component
  method,
  value?: string,
  networkId
) => {
  const from = toChecksumAddress(injected, accounts[0])
  const sanitizedArgs = sanitizeTransactionArguments(args, method, injected)
  const notify = Notify({
    dappId: apiKey, // [String] The API key created by step one above
    networkId // [Integer] The Ethereum network ID your Dapp uses.
  })

  // TODO: Keep track of transactions for website owners analytics
  instance.methods[signature](...sanitizedArgs)
    .send({
      from,
      value: value ? toWei(injected, value) : null
    })
    .on('transactionHash', (hash) => {
      useBlockNative ? notify.hash(hash) : null
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

