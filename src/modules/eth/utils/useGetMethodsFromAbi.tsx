import { useEffect, useState } from "react";

//This function returns all the methods on an ABI including their Signature
//The Signature is important to be able to call overloaded functions

//We require web3 in this case to encode the function signature
export const useGetMethodsFromAbi: any = (abi, web3) => {
  const [functions, setFunctions] = useState(null);

  useEffect(() => {
    function getFunctions(abi) {
      const functions = abi.map(method => {
        return {
          ...method,
          signature: web3.eth.abi.encodeFunctionSignature(method),
          arguments: method.inputs.map(input => {
            return {
              name: input.name,
              type: input.type
            };
          })
        };
      });
      setFunctions(functions);
    }
    getFunctions(abi);
  }, []);
  return functions;
};
