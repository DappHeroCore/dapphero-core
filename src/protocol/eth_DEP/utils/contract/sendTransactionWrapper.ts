import { getTxFieldInputs } from '../element/getTxFieldInputs'
import { sendTransactionToContract } from './sendTransactionToContract'
import { clearInputFields } from './clearInputFields'

/**
 * This function wraps the sendTransactionToContract function so that we can isolate the process of
 * getting the transaction field inputs and initiating the transaction itself.
 * @param requests {} this is all the request strings associated with this transaction // TODO: be clearer about this terminology
 * @param position {} this is an index of the request string // TODO: be clear what this is supposed to be?
 * @param method {} the currenctly requested method. // TODO: be clear about what this is
 * @param injected {} this is web3 connection
 * @param instance {object} this is the contract instance
 * @param signature {string} this is the signature of the method that we are invoking.
 * @param setTxState {function} callback function to set the state of a higher up component on the status of the transaction
 * @param signifiers {} // TODO: what is this?
 */
export const sendTransactionWrapper = async (
  requests,
  position,
  method,
  injected,
  instance,
  signature,
  setTxState,
  signifiers,
) => {

  const { inputFields, txArgArray, valueArg } = getTxFieldInputs(
    requests,
    position,
    method.name,
    method,
  )

  await sendTransactionToContract(
    injected.lib,
    instance,
    signature,
    txArgArray,
    injected.accounts,
    setTxState,
    method,
    injected.networkId,
    signifiers.payable || valueArg,

  )

  clearInputFields(inputFields)

}
