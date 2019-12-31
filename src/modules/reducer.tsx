import * as React from "react";
import { Request } from "./types";
import { EthParent } from "./eth";
import { EthereumContextConsumer } from "../context/ethereum";

const reducer = (request: Request) => {
  console.log("The Request: ", request);
     switch (request.arg) {
       case "eth":
           return <EthParent request={request} />
         break;
   
       default:
         return null;
     }

};

export default reducer;