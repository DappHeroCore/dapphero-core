
import queryString from 'query-string'
import { logger } from 'logger/customLogger'

export const getQueryParameterValue = (value: string, key: string): string | string[] => {
  if (value !== '$URL') return value

  const queryParameters = queryString.parse(window.location.search)
  const queryParameter = queryParameters[key]

  if (!queryParameter) logger.error(`No query parameter ${key} defined in URL`)

  return queryParameter || ''
}
