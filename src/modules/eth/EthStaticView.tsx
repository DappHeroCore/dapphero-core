import React, { useEffect, FunctionComponent, Fragment } from 'react'
import { Request } from "../types";
import { getBalance } from "../../api/"

interface EthStaticViewProps {
  request: Request;
  injected: any; // come back to type
  accounts: any; // come back to type
}

const STATIC_MAPPING = {
  "address": (props) => props.accounts[0], // what is address web3 tag
  // "getBalance": (props) => 

}

export const EthStaticView:FunctionComponent<EthStaticViewProps> = (props) => {
  console.log('*** injected: ', props.injected)
  console.log('*** request: ', props.request)
  console.log('*** accounts: ', props.accounts)
  useEffect(() => {
    const getData = async() => {
      try {
        const el = document.getElementById(props.request.element.id)
        el.innerHTML = "hello";
      } catch(e){
        console.log(e);
      }
    }
    getData();
  }, [props])

  return null;
}

export default EthStaticView;