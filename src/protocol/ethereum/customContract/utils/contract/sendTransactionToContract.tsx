import Web3 from 'web3' // eslint-disable-line
import Notify from 'bnc-notify'
import { sanitizeTransactionArguments } from './sanitizeTransactionArguments'
import { toChecksumAddress, toWei } from '../../../../../api/ethereum'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
const useBlockNative = true

// This function will send an arbitary Transaction. It requires:
/**
 * This function will send an arbitrary transaction to the ethereum network.
 * @param injected {object} this is web3, our connection to the ethereum network.
 * @param instance {object} this is our web3 contract instance
 * @param signature {string} this is the signature of the method on the contract instance we want to call.
 * This is nessesary to call a specific function an not get confused by function overloading in solidity contracts.
 * @param args {array} An array of arguments to be provided if required.
 * @param accounts {array} the array of addresses representig the connected accounts and of the person making a transaction.
 * This should generally be acccessed like so: accounts[0]
 * @param setTxState {function} this is a call back function which will set the current tx object in the calling functional component.
 * @param method { // TODO: what is this? a string? Object?} this is the method we are invoking.
 * @param value {string} TODO: Not sure what is happening here.
 * @param networkId {number} the number that represents the ID of the network we are connected to.
 */
export const sendTransactionToContract: any = (
  injected: Web3,
  instance, // The instance of the Contract
  signature, // The Signatuer of the method being invoked
  args, // An array of arguments to be provided if required.
  account, // accounts[0] of the person calling it
  setTxState, // These two areguments are the current state of a tx object in a functional component
  method,
  networkId,
  value?: string,

) => {
  const from = toChecksumAddress(injected, account)
  const sanitizedArgs = sanitizeTransactionArguments(args, method, injected)
  const notify = Notify({
    dappId: apiKey, // [String] The API key created by step one above
    networkId, // [Integer] The Ethereum network ID your Dapp uses.
  })

  // TODO: Keep track of transactions for website owners analytics
  instance.methods[signature](...sanitizedArgs)
    .send({
      from,
      value: value ? toWei(injected, value) : null, // TODO: I don't understand what is happeing here.
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

