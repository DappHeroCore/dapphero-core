import React, { useState } from 'react'
import { EthereumContextProvider } from './context/ethereum'
import { HTMLContextProvider, HTMLContextConsumer } from './context/html'
import { reducer } from './modules/reducer'

const useForceUpdate = () => useState()[1]
// TODO: Add globaleContextProvider here to wrap entire application
export const App: React.FC = () => {
  const forceUpdate = useForceUpdate()

  return (
    <EthereumContextProvider forceUpdate={forceUpdate}>
      <HTMLContextProvider>
        <HTMLContextConsumer>
          {({ requests }) => requests.map((request) => reducer(request))}
        </HTMLContextConsumer>
      </HTMLContextProvider>
    </EthereumContextProvider>
  )
}
