import { FunctionTypes } from '../../../../types/types' //eslint-disable-line

export const getTxFieldInputs = (requests: any[], position: number, methodName: any, method: any) => {
  const newObj = {}
  const inputArgArray = []
  let valueArg = null

  const inputs = requests.filter((req) => (
    req.requestString[position] === methodName
      && req.requestString.length === position + 2
  ))

  inputs.forEach(({ requestString, element }) => {
    if (requestString[requestString.length - 1] === FunctionTypes.PAYABLE) {
      valueArg = (document.getElementById(element.id) as any).value
    }
    newObj[requestString[position + 1]] = (document.getElementById(element.id) as any).value  // eslint-disable-line
  })

  method.inputs.forEach((moduleInputs) => {
    inputArgArray.push(newObj[moduleInputs.name])
  })

  return { inputFields: inputs, txArgArray: inputArgArray, valueArg }
}
