import { useState, useEffect } from 'react'
import { getUserLoadedElements } from '../../utils'

// retVal param needed in case of function w/ multiple possible return values
function useConfirmWithUserSuppliedDomElements(
  instance,
  method,
  request,
  injected,
  element,
  signifiers
) {
  const [ value, setValue ] = useState(null)
  useEffect(() => {
    const { txProcessingElement, txConfirmedElement } = getUserLoadedElements()
    const defaultState = {
      transactionHash: null,
      confirmations: null,
      receipt: null,
      error: null
    }

    const [ txState, setTxState ] = useState(defaultState)

    const position = request.requestString.indexOf(method.name)

    const originalDomElement = element

    const elId = 'replace' // button => processing element => confirmed element => button

    const updateState = () => {
      const { transactionHash, receipt } = txState

      // tx sent
      if (transactionHash && !receipt) {
        const el = document.getElementById(element.id) // send button

        if (txProcessingElement) {
          // user-loaded element
          const txProcessingEl = txProcessingElement.cloneNode(true) as HTMLElement
          txProcessingEl.style.display = 'block'
          txProcessingEl.id = elId
          el.parentNode.replaceChild(txProcessingEl, el)
        } else {
          if (el) {
            $(el.id).prop('disabled', true)
            el.id = elId
            el.innerText = 'Processing...'
          }
        }
      }

      // tx confirmed
      if (transactionHash && receipt) {
        const el = document.getElementById(elId)

        let txConfirmedEl
        if (txConfirmedElement && el) {
          txConfirmedEl = txConfirmedElement.cloneNode(true);
          (txConfirmedEl as HTMLElement).style.display = 'block'
          txConfirmedEl.id = elId
          el.parentElement.replaceChild(txConfirmedEl, el)
        } else if (el) {
          el.innerText = 'Confirmed!'
        }

        const replaceEl = document.getElementById(elId)

        setTimeout(() => {
          const newOriginal = originalDomElement.cloneNode(true)
          replaceEl.replaceWith(newOriginal)
          setTxState(defaultState)
        }, 5000) // add this to constants file
      }
    }
    updateState()

  }, [ defaultState ])

  return value
}

export { useConfirmWithUserSuppliedDomElements }
