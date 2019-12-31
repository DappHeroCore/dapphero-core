import React, { FunctionComponent, useState, Fragment } from "react";
import { Request, dappHeroConfig } from "../types";
import { EthStaticView } from "./EthStaticView";
import { EthContractParent } from "./EthContractParent";
import { EthereumContextConsumer } from "../../context/ethereum";

interface EthParentProps {
  request: Request;
  config: dappHeroConfig;
}

export const EthParent: FunctionComponent<EthParentProps> = ({
  request,
  config
}) => {
  return (
    <EthereumContextConsumer>
      {({ connected, accounts, injected }) => {
        switch (
          request.requestString[2] //TODO Be explicit about the index
        ) {
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
            break;
          }

          case config.contractName: {
            if (connected && accounts.length > 0) {
              return (
                <EthContractParent
                  request={request}
                  injected={injected}
                  accounts={accounts}
                  config={config}
                />
              );
            }

            break;
          }

          default:
            return null;
        }
      }}
    </EthereumContextConsumer>
  );
};
