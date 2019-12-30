import React, { Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWeb3Injected } from "@openzeppelin/network/react";
import {EthParent} from "./modules/eth"

interface request {
  requestString: string[];
  element: HTMLElement;
  arg: string;
  index: number;
}

const App: React.FC = () => {
  const injected = useWeb3Injected();
  const { connected, accounts } = injected;

  const dappHeroTopLevelModule = "dh"; //MOCK THIS FOR NOW BUT LATER SHOULD COME FROM DATABASE
  const elements: any[] = Array.prototype.slice.call(
    document.querySelectorAll(`[id^=${dappHeroTopLevelModule}]`)
  );

  console.log("Elements: ", elements);

  const reducer = request => {
    console.log("The Request: ", request);
    switch (request.arg) {
      case "eth":
        if (connected && accounts.length > 0) {
          return null;
        }
        break;

      default:
        return null;
    }
  };
  return (
    <Fragment>
      {elements.map(element => {
        const domElementId = element.id;
        const requestString = domElementId.split("-");
        const index = 1;
        const request: request = {
          requestString,
          element,
          arg: requestString[index],
          index
        };
        return reducer(request);
      })}
    </Fragment>
  );

  return null;
};

export default App;
