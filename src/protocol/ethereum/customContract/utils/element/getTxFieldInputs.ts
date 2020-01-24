enum FunctionTypes {
  VIEW = 'view',
  NONPAYABLE = 'nonpayable',
  PAYABLE = 'payable'
}

// WILL DELETE SOON...keeping for easy reference until refactor is complete

// export const getTxFieldInputs = (requests: any[], position: number, methodName: any, method: any) => {
//   const newObj = {}
//   const inputArgArray = []
//   let valueArg = null

//   const inputs = requests.filter((req) => (
//     req.requestString[position] === methodName
//       && req.requestString.length === position + 2
//   ))

//   inputs.forEach(({ requestString, element }) => {
//     if (requestString[requestString.length - 1] === FunctionTypes.PAYABLE) {
//       valueArg = (document.getElementById(element.id) as any).value
//     }
//     newObj[requestString[position + 1]] = (document.getElementById(element.id) as any).value  // eslint-disable-line
//   })

//   method.inputs.forEach((moduleInputs) => {
//     inputArgArray.push(newObj[moduleInputs.name])
//   })

//   return { inputFields: inputs, txArgArray: inputArgArray, valueArg }
// }

enum CustomContractString {
  TYPE = 5,
  INPUT = 6
}

enum CustomContractType {
  INPUT = 'input',
  INVOKE = 'invoke'
}

// This methodology applies to the id string approach to DH
// i.e. dh-customContract-dynamic-name:DappHeroTest-methodName:triggerEvent-input-input:value
// Data tags will require separate parsing mechanism
export const getTxFieldInputs = (functionNodes: any, abi: any, methodObj: any) => {
  const args = {}
  functionNodes.forEach((fn) => {
    const requestString = fn.id.split('-')

    // this means it's an input element, not the invoke
    if (requestString[CustomContractString.TYPE] === CustomContractType.INPUT) {
      const argItem = requestString[CustomContractString.INPUT].split(':')[1] // name of arg in contract
      args[argItem] = document.getElementById(fn.id).value // value of arg
    }
  })

  return methodObj.inputs.map((input) => args[input.name]) // array of the func args in order
}
