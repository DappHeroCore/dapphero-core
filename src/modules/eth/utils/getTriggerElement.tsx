const getTriggerElement = (modules, request, position) => {
  let triggerElement = modules.filter((module) => (
    module.requestString[position] === request
      && module.requestString.length === position + 1
  ))
  triggerElement = triggerElement[0].element
  triggerElement = document.getElementById(triggerElement.id)
  return triggerElement
}

export { getTriggerElement }
