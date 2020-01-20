import React from 'react'
import { featureReducer } from './protocol/ethereum/featureReducer'

const requests = Array.prototype.slice
  .call(document.querySelectorAll(`[id^=dh]`))
  .map((element) => {
    const domElementId = element.id
    const requestString = domElementId.split('-')
    const index = 1
    return {
      requestString,
      element,
      feature: requestString[index],
      index,
    }
  })

export const App: React.FC = () => (
  requests.map((request) => featureReducer(request, request.element))
)
