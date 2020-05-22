import { ethers } from 'ethers'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { write } from 'fs'
import { ACTION_TYPES } from './stateMachine'

export const sendTx = async ({ writeContract, dispatch, provider, methodName, methodParams, value, notify, emitToEvent, methodNameKey }): Promise<void> => {

  const methodDetails = { methodName, methodParams, contractAddress: writeContract.address, contractNetwork: writeContract.provider._network.name }
  const method = writeContract.functions[methodName]
  const gasPrice = await provider.getGasPrice()
  const estimateMethod = writeContract.estimateGas[methodName]
  let estimatedGas

  const tempOverride = { value: ethers.utils.parseEther(value) }
  // TODO: Allow users to set Gas Price
  console.log('value', value)
  // console.log("tempOverride", tempOverride)

  dispatch({
    type: ACTION_TYPES.txUserSignatureRequested,
    status: {
      ...methodDetails,
      msg: 'Estimate Gas Cost of Transaction',
      error: false,
      fetching: true,
      inFlight: false,
    },
  })

  // CallStatic first
  let callStatic
  try {
    console.log('Calling Static')
    callStatic = await writeContract.callStatic[methodName](...methodParams, tempOverride)
    console.log('callStatic result', callStatic)
  } catch (error) {
    console.log('Error Reason:', error.reason)

  }

  try {
    estimatedGas = await estimateMethod(...methodParams, tempOverride)
    // const valueStatic = await method(...methodParams, tempOverride)
    // console.log('valueStatic', valueStatic)

    dispatch({
      type: ACTION_TYPES.txUserSignatureRequested,
      status: {
        ...methodDetails,
        msg: 'Estimate Gas Cost of Transaction Succedded',
        error: false,
        fetching: true,
        inFlight: false,
        estimatedGas: estimatedGas.toString(),
      },
    })

  } catch (error) {
    console.log('Estimate gas error', error)
    dispatch({
      type: ACTION_TYPES.estimateGasError,
      status: {
        ...methodDetails,
        msg: 'Estimate Gas Cost of Transaction Failed',
        error,
        fetching: false,
        inFlight: false,
      },
    } )
  }

  const overrides = {
    gasLimit: estimatedGas,
    gasPrice,
    value: ethers.utils.parseEther(value),
  }
  let methodResult

  dispatch({
    type: ACTION_TYPES.txUserSignatureRequested,
    status: {
      ...methodDetails,
      msg: 'User signature requsted',
      error: false,
      fetching: true,
      inFlight: false,
    },
  })

  try {
    // console.log('MethodNAme: ', methodName)
    // console.log('contract: ', writeContract.functions)
    // const method = writeContract.functions[methodName]
    console.log('The Overrides: ', overrides)
    console.log('The methodParams: ', methodParams)
    methodResult = await writeContract.functions[methodName](...methodParams, overrides)
    console.log('methodParams', methodParams)

    dispatch({
      type: ACTION_TYPES.txReceipt,
      status: {
        msg: `TX Broadcast.`,
        error: false,
        fetching: true,
        inFlight: true,
        txReceipt: methodResult.hash,
        ...methodDetails,
      },
    })

    provider.once(methodResult.hash, (receipt) => {
      dispatch({
        type: ACTION_TYPES.confirmed,
        status: {
          ...methodDetails,
          msg: `Transaction confirmed. Hash: ${methodResult.hash}`,
          error: false,
          fetching: false,
          inFlight: false,
          receipt,
        },
      })
    })

    // // BlockNative Toaster to track tx
    const { emitter } = notify.hash(methodResult.hash)

    emitter.on('txSent', (data) => {
      emitToEvent(
        EVENT_NAMES.contract.statusChange,
        { value: data, step: 'Transaction has been sent to the network', status: EVENT_STATUS.pending, methodNameKey },
      )
    })
    emitter.on('txFailed', (data) => emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: data, step: 'Transaction sent to network but failed to be mined.', status: EVENT_STATUS.rejected, methodNameKey },
    ) )
    emitter.on('txConfirmed', (data) => emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: data, step: 'Transaction has been sent to the network', status: EVENT_STATUS.resolved, methodNameKey },
    ) )

    // Set Result on State
    return methodResult.hash

  } catch (error) {
    console.log(Object.keys(error))
    console.log(JSON.stringify(error, null, 2))
    emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: error, step: 'Transaction failed to be broadcast/executed', status: EVENT_STATUS.rejected, methodNameKey },
    )
    dispatch({
      type: ACTION_TYPES.txError,
      status: {
        ...methodDetails,
        msg: 'Transaction failed. Check console for more details.',
        error,
        inFlight: false,
        fetching: false,
      },
    } )
  }
}
