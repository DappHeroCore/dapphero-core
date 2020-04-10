
import queryString from 'query-string'
import { logger } from 'logger/customLogger'

// Utils
import { ethers } from 'ethers'

// Constants
export const URL = '$URL'
export const CURRENT_USER = '$CURRENT_USER'
export const ALLOWED_VALUES = [ URL, CURRENT_USER ]

function isAddress(address: string): boolean {
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    return false
  }

  return true
}

export const getQueryParameterValue = (value: string, key: string, userAddress?: string): string | string[] => {
  if (!ALLOWED_VALUES.includes(value)) return value

  // Return current user address from provider
  if (key === 'assetOwnerAddress' && value === CURRENT_USER) return userAddress

  // Parse query params
  const queryParameters = queryString.parse(window.location.search)
  const queryParameter = queryParameters[key]

  // Validate user address from url
  if (value === CURRENT_USER && !isAddress(userAddress)) logger.info(`Invalid user address ${userAddress} defined in URL`)

  if (!queryParameter) logger.info(`No query parameter ${key} defined in URL`)

  return queryParameter || ''
}
