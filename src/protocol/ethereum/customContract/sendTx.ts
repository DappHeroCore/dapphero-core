import { ethers } from 'ethers'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { ACTION_TYPES } from './stateMachine'

export const sendTx = async ({ writeContract, dispatch, provider, methodName, methodParams, value, notify, emitToEvent, methodNameKey }): Promise<void> => {

  const methodDetails = { methodName, methodParams, contractAddress: writeContract.address, contractNetwork: writeContract.provider._network.name }
  const method = writeContract.functions[methodName]
  const gasPrice = await provider.getGasPrice()
  const estimateMethod = writeContract.estimate[methodName]
  let estimatedGas

  const tempOverride = { value: ethers.utils.parseEther(value) }
  // TODO: Allow users to set Gas Price

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

  try {
    estimatedGas = await estimateMethod(...methodParams, tempOverride)

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

    methodResult = await method(...methodParams, overrides)

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
      { value: data, step: 'Transaction failed', status: EVENT_STATUS.rejected, methodNameKey },
    ) )
    emitter.on('txConfirmed', (data) => emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: data, step: 'Transaction has been sent to the network', status: EVENT_STATUS.resolved, methodNameKey },
    ) )

    // Set Result on State
    return methodResult.hash

  } catch (error) {
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
