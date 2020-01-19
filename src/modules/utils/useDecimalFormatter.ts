export const useDecimalFormatter = (
  value: any,
  decimal: string
) => {
  if (!decimal) return value

  return Number(value).toFixed(Number(decimal))
}
