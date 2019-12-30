import React, { FunctionComponent, useState } from 'react';

interface request {
  requestString: string[];
  element: HTMLElement;
  arg: string;
  index: number;
}

// our components props accept a number for the initial value
export const EthParent:FunctionComponent<request> = (request) => {
  // since we pass a number here, clicks is going to be a number.
  // setClicks is a function that accepts either a number or a function returning
  // a number
  const [clicks, setClicks] = useState(0);
  return <>
    <p>Clicks: {clicks}</p>
    <button onClick={() => setClicks(clicks+1)}>+</button>
    <button onClick={() => setClicks(clicks-1)}>-</button>
  </>
}