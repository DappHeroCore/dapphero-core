/**
 * This function adds a click hander to an HTML element which is identified by the user
 * as a "trigger emlement". A trigger element is an element which initiates some kind of
 * action when clicked on (or interacted with). In this case it is typically a button and
 * used to allow the front end to initiate a blockchain transacstion on the user behalf.
 * @param triggerElement {HTMLElement} the target DOM element for a onClick function.
 * @param callBackFunction {function} the function which is invoked when element is clicked.
 */
export const addClickHandlerToTriggerElement = (triggerElement, callBackFunction) => {
  if (triggerElement) {
    const triggerClone = triggerElement.cloneNode(true)
    // TODO: clone element to remove all prev event listeners. is there a better way?
    triggerElement.replaceWith(triggerClone)
    triggerClone.addEventListener('click', callBackFunction)
  }

}
