export const addClickHandlerToTriggerElement = (triggerElement, callBackFunction) => {
  if (triggerElement) {
    const triggerClone = triggerElement.cloneNode(true)
    // TODO: clone element to remove all prev event listeners. is there a better way?
    triggerElement.parentNode.replaceChild(triggerClone, triggerElement)
    triggerClone.addEventListener('click', callBackFunction)
  }

}
