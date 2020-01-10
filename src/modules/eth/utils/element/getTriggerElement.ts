const getTriggerElement = (requests, method, position) => {
  let triggerElement = requests.filter((req) => (
    req.requestString[position] === method
      && req.requestString.length === position + 1
  ))
  triggerElement = triggerElement[0].element
  triggerElement = document.getElementById(triggerElement.id)
  return triggerElement
}

export { getTriggerElement }
