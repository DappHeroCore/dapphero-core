import React, { useEffect, FunctionComponent } from "react";
import { Request, DappHeroConfig } from "../types";
import { EthContractStaticView } from "./EthContractStaticView";

import { useContractInstance } from "../utils/useContractInstance";
import { useGetMethods } from "../utils/useGetMethods";

import ERC20 from "../../abi/ERC20.json"; // from db
let contractAddressMock = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //WETH on Mainnet

enum FunctionTypes {
  view = "view",
  nonpayable = "nonpayable",
  payable = "payable"
}

interface EthContractParentProps {
  request: Request;
  config: DappHeroConfig;
  injected: any; // build this type
  accounts: string[];
  element: HTMLElement;
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
        case FunctionTypes.view: {
          // "view" func
          if (!func.inputs.length) {
            // no args
            return (
              <EthContractStaticView
                instance={instance}
                method={func}
                element={element}
              />
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return null;
};

export default EthContractParent;
