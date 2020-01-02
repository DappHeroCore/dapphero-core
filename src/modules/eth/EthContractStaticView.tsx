import React, { useEffect, FunctionComponent, Fragment } from "react";
import { useGetStaticFunc } from "../utils/useGetStaticFunc";

interface EthContractStaticViewProps {
  instance: any; // add type
  method: any; // add type
  element: HTMLElement;
}

export const EthContractStaticView: FunctionComponent<
  EthContractStaticViewProps
> = ({ instance, method, element }) => {
  const { signature } = method;
  const value = useGetStaticFunc(instance, signature);
  
  const el = document.getElementById(element.id);
  el.innerText = value;
  el.style.color = "blue"

  return null;
};
