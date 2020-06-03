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
      if (outputValueType === 'ascii') {
        return ethers.utils.parseBytes32String(value)
        // This is a reference to when arrays are returned.
        // return (
        //   Array.isArray(value) ? ethers.utils.parseBytes32String(value[0]) : ethers.utils.parseBytes32String(value)
        // )
      }
      if (outputValueType === 'bytes32') return value
      break
    }
    case ('ascii'): {
      if (outputValueType === 'bytes32') {
        const utf8Array = ethers.utils.toUtf8Bytes(value)
        const utf8String = ethers.utils.toUtf8String(utf8Array)
        return ethers.utils.formatBytes32String(utf8String)
      }
      if (outputValueType === 'ascii') return value
      break
    }
    default: {

      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(inputValueType) && !isNaN(outputValueType)) {
        if (inputValueType === outputValueType) return value
        // value is 999,000,000 contractUnits 6: ouput units is 1: want to see 999
        let outputValue
        try {
          outputValue = ((value * parseInt(inputValueType)) / outputValueType).toString()
          return outputValue
        } catch (error) {
          logger.warn(`There was a problem formatting your intput value type 
      ${inputValueType} to output value type: ${outputValueType}. The error is: ${error}`)
        }
        break
      }

      const error = new Error(`You attempted to convert units using inputType: ${inputValueType} which is not supported`)
      logger.warn(error)
      throw error
    }
  }
  const error = new Error(`You attempted to convert units using outputType: ${outputValueType} which is not supported`)
  logger.warn(error)
  throw error
}
