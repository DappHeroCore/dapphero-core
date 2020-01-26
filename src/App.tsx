import React, { useEffect } from 'react'
import * as api from 'api'
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

export const App: React.FC = () => {
  useEffect(() => {
    (async () => {
      const contracts = await api.dappHero.getContractsByProjectUrl('test.com/dev')
      console.log(contracts)
    }
    )()
  }, [])
  return (
    requests.map((request, i) => featureReducer(request, request.element, i))
  )
}
