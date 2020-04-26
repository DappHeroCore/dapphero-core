import { ethers } from 'ethers'
import { logger } from 'logger/customLogger'
import { ACTION_TYPES } from './stateMachine'

export const sendTx = async ({ writeContract, dispatch, provider, methodName, methodParams, value, notify }): Promise<void> => {

  const methodDetails = { methodName, methodParams, contractAddress: writeContract.address, contractNetwork: writeContract.provider._network.name }
  const method = writeContract.functions[methodName]
  const gasPrice = await provider.getGasPrice()
  const estimateMethod = writeContract.estimate[methodName]
  let estimatedGas

  const tempOverride = { value: ethers.utils.parseEther(value) }

  dispatch({
    type: ACTION_TYPES.txUserSignatureRequested,
    status: {
      msg: 'User Signature Requested',
      error: false,
      ...methodDetails,
    },
  })

  try {
    estimatedGas = await estimateMethod(...methodParams, tempOverride)
  } catch (error) {
    dispatch({
      type: ACTION_TYPES.estimateGasError,
      status: {
        msg: 'Error estimating the gas cost for this transaction.',
        error,
        ...methodDetails,
      },
    } )
    logger.error('estimateGasMethod failed', error)
  }

  const overrides = {
    gasLimit: estimatedGas,
    gasPrice,
    value: ethers.utils.parseEther(value),
  }
  let methodResult

  try {
    methodResult = await method(...methodParams, overrides)

    dispatch({
      type: ACTION_TYPES.txReceipt,
      status: {
        msg: `TX Broadcast.`,
        error: false,
        txReceipt: methodResult.hash,
        ...methodDetails,
      },
    })

    provider.once(methodResult.hash, (receipt) => {
      dispatch({
        type: ACTION_TYPES.confirmed,
        status: {
          msg: 'TX Confirmed.',
          error: false,
          receipt,
          ...methodDetails,
        },
      })
    })
    // BlockNative Toaster to track tx
    const { emitter } = notify.hash(methodResult.hash)

    // Set Result on State
    return methodResult.hash

  } catch (error) {
    dispatch({
      type: ACTION_TYPES.txError,
      status: {
        msg: 'There was an error and the transaction failed.',
        error,
        ...methodDetails,
      },
    } )
    logger.info('invoke contract method failed in transaction', error)
  }
}
