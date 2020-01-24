enum CustomContractString {
  TYPE = 5,
  INPUT = 6
}

enum CustomContractType {
  INPUT = 'input',
  INVOKE = 'invoke',
  PAYABLE = 'payable'
}

// This methodology applies to the id string approach to DH
// i.e. dh-customContract-dynamic-name:DappHeroTest-methodName:triggerEvent-input-input:value
// Data tags will require separate parsing mechanism
export const getTxFieldInputs = (functionNodes: any, abi: any, methodObj: any) => {
  const args = {}
  let payableValue

  functionNodes.forEach((fn) => {
    const requestString = fn.id.split('-')

    // this means it's an input element, not the invoke
    if (requestString[CustomContractString.TYPE] === CustomContractType.INPUT) {
      const argItem = requestString[CustomContractString.INPUT].split(':')[1] // name of arg in contract

      if (argItem === CustomContractType.PAYABLE) {
        payableValue = (document.getElementById(fn.id) as HTMLInputElement).value
      } else {
        args[argItem] = (document.getElementById(fn.id) as HTMLInputElement).value // value of arg
      }
    }
  })

  return {
    inputArgs: methodObj.inputs.map((input) => args[input.name]), // array of the func args in order
    payableValue,
  }
}
