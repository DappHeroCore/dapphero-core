import React, { useEffect, useState, FunctionComponent } from "react";
import { callPublicMethodWithArgs } from "./utils/callPublicMethodWithArg";
import { Request, EthContractProps } from "../types";

type EthContractViewArgsProps = EthContractProps & {
  // any more?
}

// This feature right now is just single argument, single
// return value functions called as soon as component renders,
// the most common example being an ERC20 token balance.
// TODO: Building for multiple arguments immediate-view functionality
// TODO: Building for multiple return values immediate-view functionality
// TODO: Building for mult arg, mult return values onClick functionality
export const EthContractViewArgs: FunctionComponent<
  EthContractViewArgsProps
> = ({ instance, method, element, request, injected }) => {
  const { signature } = method;
  const [value, setValue] = useState(null);

  let pointerIndex = 3; // this is where param-arg pairs begin
  // does user even need to specify param name though?

  let argument = request.requestString[pointerIndex + 1];
  if(argument === "user"){
      argument = injected.accounts[0];
  }

  callPublicMethodWithArgs(instance, signature, argument, setValue)
 
  element.innerText = value;
  element.style.color = "blue";
  return null;
};
