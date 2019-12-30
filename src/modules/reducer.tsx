import * as React from "react";
import { Request } from "./types";
import { EthParent } from "./eth";

const reducer = (request: Request, connected: boolean, accounts: string[]) => {
  console.log("The Request: ", request);
  switch (request.arg) {
    case "eth":
      if (connected && accounts.length > 0) {
        return <EthParent request={request} />
      }
      break;

    default:
      return null;
  }
};

export default reducer;