import React, { useEffect, FunctionComponent } from "react";
import { EthContractProps } from "../types";
import { EthContractViewStatic } from "./EthContractViewStatic";
import { EthContractViewArgs } from "./EthContractViewArgs";
import { EthContractSendTx } from "./EthContractSendTx";

import { useContractInstance } from "./utils";
import { useGetMethods } from "./utils";

import ERC20 from "../../abi/ERC20.json"; // from db
let contractAddressMock = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //WETH on Mainnet

enum FunctionTypes {
  VIEW = "view",
  NONPAYABLE = "nonpayable",
  PAYABLE = "payable"
}

type EthContractParentProps = EthContractProps & {
  // any more?
}

export const EthContractParent: FunctionComponent<EthContractParentProps> = ({
  request,
  injected,
  element
}) => {
  const method = request.requestString[3];
  const instance = useContractInstance(
    ERC20,
    contractAddressMock,
    injected.lib
  );
  const methods = useGetMethods(ERC20, injected.lib);

  if (instance && methods) {
    try {
      // TODO: Set up method for differentiating between functions
      // with same name and different number of args
      const func = methods.filter(m => m.name === method)[0];

      switch (func.stateMutability) {
        case FunctionTypes.VIEW: {
          // "view" func
          if (!func.inputs.length) {
            // no args
            return (
              <EthContractViewStatic
                instance={instance}
                method={func}
                element={element}
              />
            );
          } else {
            return (
              <EthContractViewArgs
                instance={instance}
                method={func}
                request={request}
                element={element}
                injected={injected}
              />
            );
          }
        }

        case FunctionTypes.NONPAYABLE: {
          return (
            <EthContractSendTx 
              method={func} 
              element={element} 
              request={request}
              injected={injected}
              instance={instance}
              />
          )
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return null;
};

export default EthContractParent;
