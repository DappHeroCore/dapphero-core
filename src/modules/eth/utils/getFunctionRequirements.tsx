// We put in an array of functions plus web3 to encode function signatures
// Then we return a list of requirements for each function. The structure looks like:
// {
//     signature: 0x...,
//     name: functionName,
//     arguments: [{
//         name: argumentName,
//         type: argumentType
//     }]
// }
// This is important for checking later if we have all the arguments needed

interface FuncRequirements {
  signature: string;
  name: string;
  arguments: {
    name: string;
    type: string;
  }[];
  outputs: {[key: string]: any};
}

export const getFuncRequirements = (listOfFunctions, web3): FuncRequirements[] => {
  const reqs = listOfFunctions.map((func) => ({
    signature: web3.eth.abi.encodeFunctionSignature(func),
    name: func.name,
    arguments: func.inputs.map((input) => ({
      name: input.name,
      type: input.type,
    })),
    outputs: func.outputs,
  }))
  return reqs
}
