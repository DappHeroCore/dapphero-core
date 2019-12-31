import React, { useEffect, FunctionComponent, Fragment } from "react";
import { Request } from "../types";
import { getBalance, currentProvider } from "../../api/ethereum";

interface EthEnableProps {
  request: Request;
  injected: any; // come back to type
  accounts: any; // come back to type
}


export const EthEnable: FunctionComponent<EthEnableProps> = props => {
  const {injected, request} = props;
  const requestString = props.request.requestString[2];

  const web3Enable = async () => {
    await injected.requestAuth()
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const el = document.getElementById(request.element.id);
        el.addEventListener('click', web3Enable, false);

      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [props]);

  return null;
};

export default EthEnable;
