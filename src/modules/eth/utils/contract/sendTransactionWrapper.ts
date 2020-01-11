import { getTxFieldInputs } from '../element/getTxFieldInputs'
import { sendTransactionToContract } from './sendTransactionToContract'
import { clearInputFields } from './clearInputFields'

export const sendTransactionWrapper = async (
  requests,
  position,
  method,
  injected,
  instance,
  signature,
  setTxState,
  signifiers
) => {

  const { inputFields, txArgArray, valueArg } = getTxFieldInputs(
    requests,
    position,
    method.name,
    method
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
