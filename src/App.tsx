import React from 'react'
import { EthereumContextProvider } from './context/ethereum'
import { HTMLContextProvider, HTMLContextConsumer } from './context/html'
import { reducer } from './modules/reducer'

export const App: React.FC = () => (
  <EthereumContextProvider>
    <HTMLContextProvider>
      <HTMLContextConsumer>
        {({ requests }) => requests.map((request) => reducer(request))}
      </HTMLContextConsumer>
    </HTMLContextProvider>
  </EthereumContextProvider>
)
