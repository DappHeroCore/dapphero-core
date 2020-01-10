// This function is designed to get all the input arguments required for the
// input of a methos.

// This is based on the old structure from the POC version so will need to be
// redone. I am including it to show how I did it before.

// Basically we take in all the elements for the module, so for example "transfer"
// requires a transfer-amount and transfer-recipient elements.

export const getInputArgumentFields: {inputFields: {[key: string]:string}[], txArgArray: string[]} = (modules, position, request, method) => { //eslint-disable-line

  const inputFields = modules.filter((module) => module.requestString[position] === request
      && module.requestString.length === position + 2)

  const newObj = inputFields.reduce((acc, module) => {
    const element = (<HTMLInputElement>document.getElementById(module.element.id))
    return { ...acc, [module.requestString[position + 1]]: element.value }
  }, {})

  const txArgArray = method.inputs.map((thisMethod) => newObj[thisMethod.name])
  return { inputFields, txArgArray }
}
