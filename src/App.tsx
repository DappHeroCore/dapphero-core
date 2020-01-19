import React from 'react'
import { EthereumContextProvider, EthereumContext } from './context/ethereum'
import { featureReducer } from './modules/ethereum/featureReducer'

const requests = Array.prototype.slice
  .call(document.querySelectorAll(`[id^=dh]`))
  .map((element) => {
    const domElementId = element.id
    const requestString = domElementId.split('-')
    const index = 1
    return {
      requestString,
      element,
      protocol: requestString[index],
      index,
    }
  })

export const App: React.FC = () => (
  <EthereumContextProvider>
    <EthereumContext.Consumer>
      {({ connected, accounts, injected }: {[key:string]: any}) => (
        requests.map((request) => featureReducer(request, request.element, connected, accounts, injected))
      )}
    </EthereumContext.Consumer>
  </EthereumContextProvider>
)
