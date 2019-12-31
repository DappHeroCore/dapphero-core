import React, { createContext } from "react";
import { useWeb3Injected } from "@openzeppelin/network/react";

const modules = ["eth", "erc20"];

const EthereumContext = createContext({});

function EthereumContextProvider(props) {
  const injected = useWeb3Injected();
  const { connected, accounts } = injected;
  const initialContextValue = {
    injected,
    connected,
    accounts,
    modules
  };

  return (
    <EthereumContext.Provider value={initialContextValue}>
      {props.children}
    </EthereumContext.Provider>
  );
}

function EthereumContextConsumer(props) {
  return <EthereumContext.Consumer>{props.children}</EthereumContext.Consumer>;
}

export { EthereumContextConsumer, EthereumContextProvider };
