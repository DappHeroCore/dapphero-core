const getTriggerElement = (modules, request, position) => {
  let triggerElement = modules.filter((module) => {
    console.log('TRIGGEREL: MODULE', module)
    return (
      module.requestString[position] === request
      && module.requestString.length === position + 1
    )
  })
  triggerElement = triggerElement[0].element
  triggerElement = document.getElementById(triggerElement.id)
  console.log('**TRIGGER ELEMENT', triggerElement)
  return triggerElement
}

export { getTriggerElement }
