import { logger } from 'logger'
import React, { useEffect, FunctionComponent } from 'react'
import { Request, RequestString } from '../types'
import { getBalance } from '../../api/ethereum'
import { useUnitAndDecimalFormat } from '../utils'

interface EthNetworkInfoProps {
  request: Request;
  injected: {[key: string]: any};
  accounts: string[];
  infoType: 'id' | 'name' | 'provider',
  element: HTMLElement
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

export const EthNetworkInfo: FunctionComponent<EthNetworkInfoProps> = (props) => { // eslint-disable-line
  const { request, element, injected, infoType } = props
  const requestString = request.requestString[RequestString.ETH_PARENT_TYPE] // eslint-disable-line

  useEffect(() => {
    const getData = async () => {
      try {
        if (infoType === 'id') {
          const id = await injected.lib.givenProvider.networkVersion()
          element.innerHTML = id
        }
        if (infoType === 'name') {
          const name = NETWORK_MAPPING[injected.lib.givenProvider.networkVersion]
          element.innerHTML = name
        }
        if (infoType === 'provider') {
          const provider = injected.providerName
          element.innerHTML = provider
        }
      } catch (e) {
        logger.debug(e)
      }
    }
    getData()
  }, [ props ])

  return null
}
