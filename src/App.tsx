import React, { Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWeb3Injected } from "@openzeppelin/network/react";
import { EthParent } from "./modules/eth"
import reducer from "./modules/reducer"
import { Request } from "./modules/types";

const App: React.FC = () => {
  const injected = useWeb3Injected();
  const { connected, accounts } = injected;

  const dappHeroTopLevelModule = "dh"; //MOCK THIS FOR NOW BUT LATER SHOULD COME FROM DATABASE
  const elements: any[] = Array.prototype.slice.call(
    document.querySelectorAll(`[id^=${dappHeroTopLevelModule}]`)
  );

  console.log("Elements: ", elements);

  return (
    <Fragment>
      {elements.map(element => {
        const domElementId = element.id;
        const requestString = domElementId.split("-");
        const index = 1;
        const request: Request = {
          requestString,
          element,
          arg: requestString[index],
          index
        };
        return reducer(request, connected, accounts);
      })}
    </Fragment>
  );

  return null;
};

export default App;
