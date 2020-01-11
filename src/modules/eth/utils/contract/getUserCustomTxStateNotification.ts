import $ from 'jquery'
// TODO: Find a way to remove jquery and do everything with pure JS and document.something

/**
 * This function allows users to supply their own UI elements in the form of HTML elements
 * which toggle their visibility based on the status of a transaction's confirmation status.
 * This allows users to create more custom UI.
 * @param txState {object} the current state of a given transaction
 * @param setTxState {function} the function called to set transaction state, on the above components state.
 * @param defaultState {object} this is the default state of all transaction info being set to null.
 * @param txProcessingElement {HTMLElmeent} this is the element which communicates a transaction is in-flight.
 * @param txConfirmedElement {HTMLElement} this is the element which communicates a transaction has confirmed.
 * @param element {HTMLElement} this is the original element which is linked to transaction state
 */

// TODO: what is "element"? and what is it doing?
// TODO: We should seperate the functionality of clearing the TX state from the custom user notifications.

export const getUserCustomTxStateNotification = (txState, setTxState, defaultState, txProcessingElement, txConfirmedElement, element) => {

  const elId = 'replace' // button => processing element => confirmed element => button
  const originalDomElement = element

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
      // TODO: Should this function be responsible for resetting the state of the TX in the element?
      // That feels like another function should be responsbile for that.
    }, 5000) // add this to constants file
  }
}

