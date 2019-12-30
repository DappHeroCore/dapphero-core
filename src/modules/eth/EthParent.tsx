import React, { FunctionComponent, useState } from "react";
import { Request } from "../types";
import { EthChild } from "./EthViewStatic";

interface EthParentProps {
  request: Request;
}

// our components props accept a number for the initial value
export const EthParent: FunctionComponent<EthParentProps> = ({ request }) => {
  // since we pass a number here, clicks is going to be a number.
  // setClicks is a function that accepts either a number or a function returning
  // a number
  const reducer = () => {
    switch (request.arg) {
      case "address":
        return <EthChild request={request} />;
    }
  };

  return <div>eth</div>;
};
