
//This function is designed to get all the input arguments required for the 
//input of a methos. 

//This is based on the old structure from the POC version so will need to be
//redone. I am including it to show how I did it before.

//Basically we take in all the elements for the module, so for example "transfer"
//requires a transfer-amount and transfer-recipient elements. 


export const getInputArgumentFields: any = (modules, position, request, method) => {
  let newObj = {}
  let inputArgArray = []
  let inputs = modules.filter(module => {
    return (
      module.requestString[position] === request &&
      module.requestString.length === position + 2
    )
  })

  inputs.map(module => {
    newObj[
      module.requestString[position + 1]
    ] = document.getElementById(module.element.id).value
  })

  method.inputs.map(method => {
    inputArgArray.push(newObj[method.name])
  })
  return {inputFields: inputs, txArgArray: inputArgArray}
}
