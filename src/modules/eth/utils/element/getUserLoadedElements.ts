export const getUserLoadedElements = () => {
  const txProcessingElement = document.getElementById('dh-eth-txProcessing')
  const txConfirmedElement = document.getElementById('dh-eth-txConfirmed')

  return {
    txProcessingElement,
    txConfirmedElement
  }
}
