import { useDecimalFormatter } from './useDecimalFormatter'
import { useDisplayFormatter } from './useDisplayFormatter'

// TODO: this function needs to be tested for invalid user formatting and decimal inputs
export const useDecimalAndDisplayFormat = (
  injected: any,
  retVal: any,
  decimals: any,
  display: any,
) => {
  const displayFormatted = useDisplayFormatter(injected, retVal, display)

  const decimalFormatted = useDecimalFormatter(
    displayFormatted,
    decimals,
  )

  return decimalFormatted
}
