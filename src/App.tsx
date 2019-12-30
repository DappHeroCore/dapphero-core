import React, { Fragment } from "react";
import Web3ContextProvider, { Web3ContextConsumer } from "./context";
import reducer from "./modules/reducer";
import { Request } from "./modules/types";

const App: React.FC = () => {
  const dappHeroTopLevelModule = "dh"; //MOCK THIS FOR NOW BUT LATER SHOULD COME FROM DATABASE
  const elements: any[] = Array.prototype.slice.call(
    document.querySelectorAll(`[id^=${dappHeroTopLevelModule}]`)
  );

  console.log("Elements: ", elements);

  return (
    <Web3ContextProvider>
      <Web3ContextConsumer>
        {({ connected, accounts }) => {
          if (!connected || !accounts) {
            return null;
          }

          return (
            <Fragment>
              {elements.map(element => {
                console.log("element:", element);
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
        }}
      </Web3ContextConsumer>
    </Web3ContextProvider>
  );
};

export default App;
