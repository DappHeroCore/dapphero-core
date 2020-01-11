import { getTxFieldInputs, sendTransactionToContract, clearInputFields } from '../../utils'

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
    signifiers.payable || valueArg,
    injected.networkId
  )

  clearInputFields(inputFields)

}
