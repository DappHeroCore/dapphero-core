import { Signifiers } from '../../../types'

export const useSignifierParser = (requestString: string[]) => {
  let unit; let decimal; let
    retVal

  const parsed = (str: string, signifier: string) => str.split(signifier)[1]

  requestString.forEach((rs) => {
    if (rs.startsWith(Signifiers.IDENTIFY_RETURN_VALUE)) {
      retVal = parsed(rs, Signifiers.IDENTIFY_RETURN_VALUE)
    }

    if (rs.startsWith(Signifiers.UNIT)) {
      unit = parsed(rs, Signifiers.UNIT)
    }

    if (rs.startsWith(Signifiers.DECIMAL)) {
      decimal = parsed(rs, Signifiers.DECIMAL)
    }
  })

  return { unit, decimal, retVal }
}
