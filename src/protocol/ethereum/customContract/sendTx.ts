import { ethers } from 'ethers'
import { logger } from 'logger/customLogger'

export const sendTx = async ({ contractInstance, provider, methodName, methodParams, value, setResult, notify }) => {

  const method = contractInstance.functions[methodName]
  const gasPrice = await provider.getGasPrice()
  const estimateMethod = contractInstance.estimate[methodName]
  let estimatedGas

  const tempOverride = { value: ethers.utils.parseEther(value) }

  try {
    estimatedGas = await estimateMethod(...methodParams, tempOverride)
  } catch (err) {
    logger.error('estimateGasMethod failed', err)
  }

  const overrides = {
    gasLimit: estimatedGas,
    gasPrice,
    value: ethers.utils.parseEther(value),
  }
  let methodResult

  try {
    methodResult = await method(...methodParams, overrides)
    // BlockNative Toaster to track tx
    notify.hash(methodResult.hash)

    // Log transaction to Database
    logger.log(methodResult)

    // Set Result on State
    setResult(methodResult.hash)
  } catch (err) {
    logger.info('invoke contract method failed in transaction', err)
  }
}
