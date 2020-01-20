import { useDecimalFormatter } from './useDecimalFormatter'
import { useUnitFormatter } from './useUnitFormatter'

// TODO: this function needs to be tested for invalid user formatting and decimal inputs
export const useUnitAndDecimalFormat = (
  injected: any,
  retVal: any,
  signifiers: { [key: string]: string },
) => {
  const unitFormatted = useUnitFormatter(injected.lib, retVal, signifiers.unit)

  const decimalFormatted = useDecimalFormatter(
    unitFormatted,
    signifiers.decimals,
  )

  return decimalFormatted
}
