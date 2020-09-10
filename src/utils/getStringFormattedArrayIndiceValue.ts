export const getStringFormattedArrayIndiceValue = (value) => {
  // eslint-disable-next-line no-restricted-globals
  if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']' && !isNaN(value.substring(1, value.length - 1))) {
    return parseInt(value.substring(1, value.length - 1), 10)
  }
  return false

}
