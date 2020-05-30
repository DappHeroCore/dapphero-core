import { ethers } from 'ethers'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { ACTION_TYPES, dsp } from './stateMachine'

export const sendTx = async ({ writeContract, dispatch, provider, methodName, methodParams, value, notify, emitToEvent, methodNameKey }): Promise<void> => {

  const methodDetails = { methodName, methodParams, contractAddress: writeContract.address, contractNetwork: writeContract.provider._network.name }
  const method = writeContract.functions[methodName]

  const gasPrice = await provider.getGasPrice()
  const estimateMethod = writeContract.estimateGas[methodName]
  let estimatedGas

  const tempOverride = { value: ethers.utils.parseEther(value) }
  // TODO: Allow users to set Gas Price

  dsp.estimateGas.start({ methodDetails, dispatch })

  // Test if tx will work, run the rest only if success
  const willTxRevert = false
  try {
    const result = await writeContract.callStatic[methodName](...methodParams, tempOverride)
    console.log('Worked? ', Boolean(result))
  } catch (error) {
    console.log('Didnt work: ', error)
  }

  try {
    estimatedGas = await estimateMethod(...methodParams, tempOverride)
    dsp.estimateGas.finish({ methodDetails, dispatch, estimatedGas })
  } catch (error) {
    dsp.estimateGas.error({ methodDetails, dispatch, error })
  }

  const overrides = {
    gasLimit: estimatedGas,
    gasPrice,
    value: ethers.utils.parseEther(value),
  }
  let methodResult

  dsp.txFlow.sigRequested({ methodDetails, dispatch })

  try {

    methodResult = await method(...methodParams, overrides)

    dsp.txFlow.txBroadcast({ methodDetails, dispatch, methodResult })

    provider.once(methodResult.hash, (receipt) => {
      dsp.txFlow.txConfirmed({ methodDetails, dispatch, methodResult, receipt })

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
    emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: error, step: 'Transaction failed to be broadcast/executed', status: EVENT_STATUS.rejected, methodNameKey },
    )
    dsp.txFlow.txError({ methodDetails, dispatch, error })
  }
}
