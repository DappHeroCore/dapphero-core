import React, { FunctionComponent, useState } from "react";
import { Request } from "../types";
import { EthStaticView } from "./EthStaticView";
import { EthereumContextConsumer } from "../../context/ethereum"

interface EthParentProps {
  request: Request;
}

// our components props accept a number for the initial value
export const EthParent: FunctionComponent<EthParentProps> = ({ request }) => {
  // since we pass a number here, clicks is going to be a number.
  // setClicks is a function that accepts either a number or a function returning
  // a number
  const reducer = () => {
    <EthereumContextConsumer>
      {({ connected, accounts, injected }) => {
        switch (request.arg) {
          case "address":
            if(connected && accounts.length > 0){
              return <EthStaticView request={request} />;
            }
        }

      }}
    </EthereumContextConsumer>
  };

  return <div>eth</div>;
};
