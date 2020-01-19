import { Signifiers, RequestString } from '../../../types' //eslint-disable-line

// TODO don't return an object with keys assigned to undefined (which is currently possible) if you want them to be empty set to null
export const useSignifierParser = (requestString: string[]) => {
  let unit = null
  let decimal = null
  let retVal = null
  let payable = null
  let childElement = null

  const parsed = (str: string, signifier: string) => str.slice(RequestString.SIGNIFIER_LENGTH)

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

    if (rs.startsWith(Signifiers.PAYABLE)) {
      payable = parsed(rs, Signifiers.PAYABLE)
    }

    if (rs.startsWith(Signifiers.CHILD_ELEMENT)) {
      childElement = parsed(rs, Signifiers.CHILD_ELEMENT)
    }

  })

  return { unit, decimal, retVal, payable, childElement }
}
