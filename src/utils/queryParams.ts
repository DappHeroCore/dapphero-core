
import queryString from 'query-string'
import { logger } from 'logger/customLogger'

const URL = '$URL'
const CURRENT_USER = '$CURRENT_USER'
const ALLOWED_VALUES = [ URL, CURRENT_USER ]

export const getQueryParameterValue = (value: string, key: string, userAddress?: string): string | string[] => {
  if (!ALLOWED_VALUES.includes(value)) return value

  // Return current user address
  if (key === 'assetOwnerAddress' && value === CURRENT_USER) return userAddress

  // Parse query params
  const queryParameters = queryString.parse(window.location.search)
  const queryParameter = queryParameters[key]

  if (!queryParameter) logger.error(`No query parameter ${key} defined in URL`)

  return queryParameter || ''
}
