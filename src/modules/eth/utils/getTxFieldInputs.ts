import { Request } from '../../types';

const getTxFieldInputs = (modules: any[], position: number, request: any, method: any) => {
  let newObj = {};
  let inputArgArray = [];
  let inputs = modules.filter(module => {
    return (
      module.requestString[position] === request &&
      module.requestString.length === position + 2
    );
  });

  console.log("***getTxFieldInputs")
  console.log("***getTxFieldInputs: inputs", inputs)
  console.log("***getTxFieldInputs: position", position)
  console.log("***getTxFieldInputs: modules", modules)
  console.log("***getTxFieldInputs: method", method)

  inputs.map(module => {
    console.log("within input: document.getElement", document.getElementById(module.element.id).value)
    newObj[module.requestString[position + 1]] = (document.getElementById(
      module.element.id
    )as any).value;
  });

  method.inputs.map(method => {
    inputArgArray.push(newObj[method.name]);
  });
  console.log("inputArgArray", inputArgArray)
  return { inputFields: inputs, txArgArray: inputArgArray };
};

export { getTxFieldInputs };
