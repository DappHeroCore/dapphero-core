import React, { useState, useEffect } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react/useWeb3Hook'
import { Reducer as MultReducer } from './multiple/Reducer'
import { Reducer as SingleReducer } from './single/Reducer'

export const Reducer = ({ element }) => {
  const injected = useWeb3Injected()
  const [ , , singleOrMult ] = element.id.split('-')
  console.log('Are we even here yet?')
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
