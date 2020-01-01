import React, { useEffect, FunctionComponent, Fragment } from 'react'
import { Request, dappHeroConfig } from '../types'
import { getBalance, currentProvider } from '../../api/ethereum'

interface EthEventProps {
  request: Request;
  injected: {[key: string]: any}; // come back to type
  accounts: string[]; // come back to type
  config: {[key: string]: any};
}

export const EthEvent: FunctionComponent<EthEventProps> = (props) => {
  const requestString = props.request.requestString[2] // We should be explicit about the request string and keep an index

  useEffect(() => {
    const getData = async () => {
      try {

      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [ props ])

  return null
}

export default EthEvent
