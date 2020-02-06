import { ethers } from 'ethers'
import { logger } from 'logger/customLogger'

export const convertUnits = (inputValueType, outputValueType, value) => {
  switch (inputValueType) {
    case ('wei'): {
      if (outputValueType === 'ether') return ethers.utils.formatEther(value)
      if (outputValueType === 'wei') return value
      break
    }
    case ('ether'): {
      if (outputValueType === 'wei') return ethers.utils.parseEther(value).toString()
      if (outputValueType === 'ether') return value
      break
    }
    case ('address'): {
      if (outputValueType === 'short') return value.slice(0, 3) + '...' + value.slice(value.length - 3)
      if (outputValueType === 'full') return value
      break
    }
    case ('bytes32'): {
      if (outputValueType === 'ascii') return ethers.utils.parseBytes32String(value)
      if (outputValueType === 'bytes32') return value
      break
    }
    case ('ascii'): {
      if (outputValueType === 'bytes32') return ethers.utils.formatBytes32String(value)
      if (outputValueType === 'ascii') return value
      break
    }
    default: {
      const error = new Error(`You attempted to convert units using inputType: ${inputValueType} which is not supported`)
      logger.warn(error)
      throw error
    }
  }
  const error = new Error(`You attempted to convert units using outputType: ${outputValueType} which is not supported`)
  logger.warn(error)
  throw error
}
