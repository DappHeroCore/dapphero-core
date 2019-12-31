import * as React from "react";
import { Request } from "./types";
import { EthParent } from "./eth";
import { EthereumContextConsumer } from "../context/ethereum";
import {dappHeroConfig} from "./types"


const getConfig = () : dappHeroConfig => {
  let config: dappHeroConfig;
  const configElement = document.getElementById('dh-config')
  config = JSON.parse(configElement.textContent)
  console.log("The config: ", config)
  console.log("Config: ", config)
  return config;
};

//This incremeents a key so each element out of reducer has unique Key so react doesn't complain. 
let reactKeyIndex=0;

const reducer = (request: Request) => {
  switch (request.arg) {
    case "eth":
      const config = getConfig()
      reactKeyIndex++;
      return <EthParent request={request} config={config} key={reactKeyIndex} />;
      break;
    default:
      return null;
  }
};

export default reducer;

