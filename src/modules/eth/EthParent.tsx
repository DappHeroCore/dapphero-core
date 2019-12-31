import React, { FunctionComponent, useState } from "react";
import { Request } from "../types";
import { EthStaticView } from "./EthStaticView";
import { EthereumContextConsumer } from "../../context/ethereum";

interface EthParentProps {
  request: Request;
}

export const EthParent: FunctionComponent<EthParentProps> = ({ request }) => {
  return (
    <EthereumContextConsumer>
      {({ connected, accounts, injected }) => {
        switch (request.requestString[2]) {
          case "address":
          case "getBalance": 
          case "getProvider":
          case "getNetworkName":
          case "getNetworkId": {
            if (connected && accounts.length > 0) {
              return (
                <EthStaticView
                  request={request}
                  injected={injected}
                  accounts={accounts}
                />
              );
            }
          }
          default:
            return null;
        }
      }}
    </EthereumContextConsumer>
  );
};
