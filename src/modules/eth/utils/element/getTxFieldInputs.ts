export const getTxFieldInputs = (modules: any[], position: number, request: any, method: any) => {
  const newObj = {}
  const inputArgArray = []
  const inputs = modules.filter((module) => (
    module.requestString[position] === request
      && module.requestString.length === position + 2
  ))

  inputs.forEach((module) => {
    newObj[module.requestString[position + 1]] = (document.getElementById(module.element.id) as any).value  // eslint-disable-line
  })

  method.inputs.forEach((moduleInputs) => {
    inputArgArray.push(newObj[moduleInputs.name])
  })

  return { inputFields: inputs, txArgArray: inputArgArray }
}
