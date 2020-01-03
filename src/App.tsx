import React, { useState, useEffect } from 'react';
import { EthereumContextProvider } from './context/ethereum';
import { HTMLContextProvider, HTMLContextConsumer } from './context/html';
import reducer from './modules/reducer';

const App: React.FC = () => {
  return (
    <EthereumContextProvider>
      <HTMLContextProvider>
        <HTMLContextConsumer>
          {({ elements, requests }) => {
            {
              return requests.map(request => {
                return reducer(request);
              });
            }
          }}
        </HTMLContextConsumer>
      </HTMLContextProvider>
    </EthereumContextProvider>
  );
};

export default App;
