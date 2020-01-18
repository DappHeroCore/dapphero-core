import React, { useEffect, FunctionComponent } from 'react'
import { Request, RequestString } from '../types'
import { getBalance } from '../../api/ethereum'
import { useUnitAndDecimalFormat } from '../utils'

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
  4: 'rinkeby',
}

const STATIC_GET_FUNCTION_MAPPING = {
  address: ({ accounts }) => accounts[0],
  getBalance: ({ accounts, injected }) => getBalance(accounts[0], injected.lib),
  getProvider: ({ injected }) => injected.providerName, // which value do we return from this obj?
  getNetworkName: ({ injected }) => NETWORK_MAPPING[injected.lib.givenProvider.networkVersion],
  getNetworkId: ({ injected }) => injected.lib.givenProvider.networkVersion,
}

export const EthStaticView: FunctionComponent<EthStaticViewProps> = (props) => { // eslint-disable-line
  const { request, injected, signifiers: { unit, decimal } } = props
  const requestString = request.requestString[RequestString.ETH_PARENT_TYPE] // eslint-disable-line

  useEffect(() => {
    const getData = async () => { // TODO: Could we use more descriptive names or just invoke the anonymous function
      try {
        const el = document.getElementById(props.request.element.id)
        const func = STATIC_GET_FUNCTION_MAPPING[requestString]

        const unformattedData = await func(props)
        const formattedData = useUnitAndDecimalFormat(injected, unformattedData, props.signifiers)

        el.innerHTML = formattedData
      } catch (e) {
        console.log(e)
      }
    }
    const thisPoll = setInterval(getData, 4000)
    // TODO: Polling shoudl be set by a configuration tool
    const stopPolling = () => {
      clearInterval(thisPoll)
    }
    return stopPolling
  }, [ props ])

  return null
}
