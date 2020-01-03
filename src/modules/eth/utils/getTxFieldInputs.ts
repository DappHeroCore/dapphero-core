export const getTxFieldInputs = (modules: any[], position: number, request: any, method: any) => {
  const inputs = modules.filter((module) => (
    module.requestString[position] === request
    && module.requestString.length === position + 2
  ))

  const newObj = inputs.reduce(
    (acc, module) => ({
      ...acc,
      [module.requestString[position + 1]]: (document.getElementById(module.element.id) as any).value // eslint-disable-line
    })
    , {}
  )

  const inputArgArray = method.inputs.map((input) => newObj[input.name])

  return { inputFields: inputs, txArgArray: inputArgArray }
}
