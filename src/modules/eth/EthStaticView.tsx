import React, { useEffect, FunctionComponent, Fragment } from "react";
import { Request } from "../types";
import { getBalance, currentProvider } from "../../api/ethereum";

interface EthStaticViewProps {
  request: Request;
  injected: any; // come back to type
  accounts: any; // come back to type
}

const NETWORK_MAPPING = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby"
};

const STATIC_MAPPING = {
  address: async ({ accounts }) => accounts[0],
  getBalance: async ({ accounts, injected }) =>
    await getBalance(accounts[0], injected.lib), // move to static args?
  getProvider: ({ injected }) => injected.providerName, // which value do we return from this obj?
  getNetworkName: ({ injected }) =>
    NETWORK_MAPPING[injected.lib.givenProvider.networkVersion],
  getNetworkId: ({ injected }) => injected.lib.givenProvider.networkVersion
};

export const EthStaticView: FunctionComponent<EthStaticViewProps> = props => {
  const requestString = props.request.requestString[2];

  useEffect(() => {
    const getData = async () => {
      try {
        const el = document.getElementById(props.request.element.id);

        const func = STATIC_MAPPING[requestString];
        const data = await func(props);

        el.innerHTML = data;
        el.style.color = "blue"; //TODO Why blue?
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [props]);

  return null;
};

export default EthStaticView;
