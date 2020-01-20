/**
 * This function find the current module that is requested and
 * identifies which module should be the trigger element for
 * initiating a transaction/triggering an action
 * @param requests {array} This is a list of all requests
 * @param method  {string} This is the specific method we are requesting
 * @param requestStringIndex  {number} This is the current index in the
 * request string that we are working with
 */

const getTriggerElement = (requests, method, requestStringIndex) => {
  let triggerElement = requests.filter((req) => (
    req.requestString[requestStringIndex] === method
      && req.requestString.length === requestStringIndex + 1
  ))
  triggerElement = triggerElement[0].element
  triggerElement = document.getElementById(triggerElement.id)
  return triggerElement
}

export { getTriggerElement }
