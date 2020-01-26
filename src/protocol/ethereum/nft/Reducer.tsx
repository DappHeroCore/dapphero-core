import React, { useEffect } from 'react'
import { Reducer as MultReducer } from './multiple/Reducer'
import { Reducer as SingleReducer } from './single/Reducer'

export const Reducer = ({ element, configuration }) => {
  const [ , , singleOrMult ] = element.id.split('-')

  useEffect(() => {}, [])

  switch (singleOrMult) {
  case 'single': {
    return (<SingleReducer element={element} />)
  }
  case 'mult': {
    return <MultReducer element={element} />
  }
  default:
    return null
  }
}
