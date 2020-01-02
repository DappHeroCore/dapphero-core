import { useEffect, useState } from "react";
import Web3 from "web3";

function useGetMethods(abi: any[], web3: Web3) {
  const [functions, setFunctions] = useState(null);

  useEffect(() => {
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
  }, []);
  
  return functions;
}

export { useGetMethods };
