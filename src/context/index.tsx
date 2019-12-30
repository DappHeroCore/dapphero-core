import React, { createContext } from "react";
import { useWeb3Injected } from "@openzeppelin/network/react";

const modules = ["eth", "erc20"];

const Web3Context = createContext({});
function Web3ContextProvider(props) {
  const injected = useWeb3Injected();
  const { connected, accounts } = injected;
  const initialContextValue = {
    injected,
    connected,
    accounts,
    modules
  };
  console.log('initialcontextvalue', initialContextValue)

  return (
    <Web3Context.Provider value={initialContextValue}>
      {props.children}
    </Web3Context.Provider>
  );
}

function Web3ContextConsumer(props) {
  return <Web3Context.Consumer>{props.children}</Web3Context.Consumer>;
}

export { Web3ContextConsumer };

export default Web3ContextProvider;
