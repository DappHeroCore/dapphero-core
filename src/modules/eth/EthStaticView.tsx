import React, { useEffect, FunctionComponent, Fragment } from 'react'
import { Request, RequestString, Signifiers } from '../types'
import { getBalance, currentProvider } from '../../api/ethereum'
import { useUnitFormatter, useDecimalFormatter } from './utils'

interface EthStaticViewProps {
  request: Request;
  injected: {[key: string]: any};
  accounts: string[];
  signifiers: {[key: string]: string};
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
  const { request, injected, signifiers: { unit, decimal } } = props
  const requestString = request.requestString[RequestString.ETH_PARENT_TYPE] // eslint-disable-line

  useEffect(() => {
    const getData = async () => {
      try {
        const el = document.getElementById(props.request.element.id)
        const func = STATIC_MAPPING[requestString]

        let data = await func(props)
        data = useUnitFormatter(injected.lib, data, unit)
        data = useDecimalFormatter(data, decimal)

        el.innerHTML = data
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [ props ])

  return null
}

export default EthStaticView
