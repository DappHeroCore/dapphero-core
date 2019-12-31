import { useState, useEffect } from "react";

//This function returns all the view functions on an abi

export const useGetViewFunctionMethods: any = abi => {
  const [viewFunctions, setViewFunctions] = useState(null);

  useEffect(() => {
    function getViewFunctions(abi) {
      const viewFunctions = abi.filter(method => {
        return method.constant;
      });
      setViewFunctions(viewFunctions);
    }
    getViewFunctions(abi);
  }, []);

  return viewFunctions;
};
