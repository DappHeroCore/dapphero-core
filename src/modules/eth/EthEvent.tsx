import React, { useEffect, FunctionComponent, Fragment } from "react";
import { Request } from "../types";
import { getBalance, currentProvider } from "../../api/ethereum";

interface EthEventProps {
  request: Request;
  injected: any; // come back to type
  accounts: any; // come back to type
}


export const EthEvent: FunctionComponent<EthEventProps> = props => {
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

export default EthEvent;
