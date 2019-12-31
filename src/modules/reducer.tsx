import * as React from "react";
import { Request } from "./types";
import { EthParent } from "./eth";
import { EthereumContextConsumer } from "../context/ethereum";
import {dappHeroConfig} from "./types"


const getConfig = () : dappHeroConfig => {
  let config: dappHeroConfig;
  const configElement = document.getElementById('dh-config')
  //TODO Clean this data to prevent injections
  config = JSON.parse(configElement.textContent)
  //Hide the Element if not hidden.
  if(configElement.style.display !== "none"){
  configElement.style.display = "none";
  }
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

