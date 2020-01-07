import React, { useEffect, FunctionComponent, Fragment } from 'react'
import { Request } from '../types'
import { getBalance, currentProvider } from '../../api/ethereum'

interface EthStaticViewProps {
  request: Request;
  injected: {[key: string]: any}; // come back to type
  accounts: string[]; // come back to type
}

const NETWORK_MAPPING = {
  // TODO Think of how to do this for side chains as well.
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby'
}

const STATIC_MAPPING = {
  address: ({ accounts }) => accounts[0],
  getBalance: ({ accounts, injected }) => getBalance(accounts[0], injected.lib), // eslint-disable-line
  getProvider: ({ injected }) => injected.providerName, // which value do we return from this obj?
  getNetworkName: ({ injected }) => NETWORK_MAPPING[injected.lib.givenProvider.networkVersion],
  getNetworkId: ({ injected }) => injected.lib.givenProvider.networkVersion
}

export const EthStaticView: FunctionComponent<EthStaticViewProps> = (props) => { // eslint-disable-line
  const requestString = props.request.requestString[2] // eslint-disable-line

  useEffect(() => {
    const getData = async () => {
      try {
        const el = document.getElementById(props.request.element.id)

        const func = STATIC_MAPPING[requestString]
        const data = await func(props)

        el.innerHTML = data
        el.style.color = 'blue' // TODO Why blue?
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [ props ])

  return null
}

export default EthStaticView
