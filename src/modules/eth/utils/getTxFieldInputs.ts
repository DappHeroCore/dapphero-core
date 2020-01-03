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

  inputs.map(module => {
    newObj[module.requestString[position + 1]] = document.getElementById(
      module.element.id
    );
    // ).value;
  });

  method.inputs.map(method => {
    inputArgArray.push(newObj[method.name]);
  });
  return { inputFields: inputs, txArgArray: inputArgArray };
};

export { getTxFieldInputs };
