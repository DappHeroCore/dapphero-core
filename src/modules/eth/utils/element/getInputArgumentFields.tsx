// This function is designed to get all the input arguments required for the
// input of a methos.

// This is based on the old structure from the POC version so will need to be
// redone. I am including it to show how I did it before.

// Basically we take in all the elements for the module, so for example "transfer"
// requires a transfer-amount and transfer-recipient elements.

export const getInputArgumentFields: {inputFields: {[key: string]:string}[], txArgArray: string[]} = (modules, position, request, method) => {

  const inputs = modules.filter((module) => module.requestString[position] === request
      && module.requestString.length === position + 2)

  const newObj = inputs.reduce((acc, module) => {
    const element: HTMLInputElement = document.getElementById(module.element.id)
    return { ...acc, [module.requestString[position + 1]]: element.value }
  }, {})

  const inputArgArray = method.inputs.map((thisMethod) => newObj[thisMethod.name])
  return { inputFields: inputs, txArgArray: inputArgArray }
}
