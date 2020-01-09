import { Request } from '../../../types'

const getTxFieldInputs = (modules: any[], position: number, request: any, method: any) => {
  const newObj = {}
  const inputArgArray = []
  const inputs = modules.filter((module) => (
    module.requestString[position] === request
      && module.requestString.length === position + 2
  ))

  inputs.forEach((module) => {
    newObj[module.requestString[position + 1]] = (document.getElementById(module.element.id) as any).value  // eslint-disable-line
  })

  method.inputs.forEach((method) => {
    inputArgArray.push(newObj[method.name])
  })

  return { inputFields: inputs, txArgArray: inputArgArray }
}

export { getTxFieldInputs }
