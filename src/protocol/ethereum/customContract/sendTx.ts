import { ethers } from 'ethers'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { write } from 'fs'
import { ACTION_TYPES } from './stateMachine'

export const sendTx = async ({ writeContract, dispatch, provider, methodName, methodParams, value, notify, emitToEvent, methodNameKey }): Promise<void> => {
  console.log('writeContract', writeContract)

  const methodDetails = { methodName, methodParams, contractAddress: writeContract.address, contractNetwork: writeContract.provider._network.name }
  const method = writeContract.functions[methodName]
  const gasPrice = await provider.getGasPrice()
  const estimateMethod = writeContract.estimateGas[methodName]
  let estimatedGas

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

  // Call Static to see if it's going to Fail and get Error Message
  let transactionValid = true

  try {
    if (value !== '0') {
      const tempOverride = { value: ethers.utils.parseEther(value) }
      await writeContract.callStatic[methodName](...methodParams, tempOverride)
    } else {
      await writeContract.callStatic[methodName](...methodParams)
    }
  } catch (error) {
    emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: error, step: `Tx will revert. Message: ${error.reason}`, status: EVENT_STATUS.rejected, methodNameKey },
    )
    dispatch({
      type: ACTION_TYPES.txError,
      status: {
        ...methodDetails,
        msg: `Tx will revert. Message:  ${error.reason}`,
        error,
        inFlight: false,
        fetching: false,
      },
    })
    transactionValid = false
  }

  // If the Contract would revert, block execution
  if (transactionValid) {
    // Estimate Gas for Transaction
    try {
      if (value !== '0') {
        estimatedGas = await estimateMethod(...methodParams, tempOverride)
      } else {
        estimatedGas = await estimateMethod(...methodParams)

      }

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
      })
    }

    // Send the Transaction
    try {
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

      if (value !== '0') {
        methodResult = await writeContract.functions[methodName](...methodParams, overrides)
      } else {
        methodResult = await writeContract.functions[methodName](...methodParams)
      }

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
      ))
      emitter.on('txConfirmed', (data) => emitToEvent(
        EVENT_NAMES.contract.statusChange,
        { value: data, step: 'Transaction has been sent to the network', status: EVENT_STATUS.resolved, methodNameKey },
      ))
      // Set Result on State
      return methodResult.hash

    } catch (error) {
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
      })
    }
  }

}
