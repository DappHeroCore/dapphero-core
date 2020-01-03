import React, { createContext } from 'react';

const HTMLContext = createContext({});

function HTMLContextProvider(props) {
  const initialContextValue = {
    elements: [],
    setElements: () => [] // needed?
  };
  const dappHeroTopLevelModule = 'dh'; //MOCK THIS FOR NOW BUT LATER SHOULD COME FROM DATABASE

  const elements: any[] = Array.prototype.slice.call(
    document.querySelectorAll(`[id^=${dappHeroTopLevelModule}]`)
  );
 
  const requests = elements.map(element => {
    const domElementId = element.id;
    const requestString = domElementId.split('-');
    const index = 1;
    return {
      requestString,
      element,
      arg: requestString[index],
      index
    };
  });

  return (
    <HTMLContext.Provider value={{ elements, requests }}>
      {props.children}
    </HTMLContext.Provider>
  );
}

function HTMLContextConsumer(props) {
  return <HTMLContext.Consumer>{props.children}</HTMLContext.Consumer>;
}

export { HTMLContextProvider, HTMLContextConsumer };
