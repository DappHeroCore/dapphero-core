import { logger } from 'logger/logger'
import { useEffect, FunctionComponent } from 'react'
import { Request } from '../../../types/types'
import { NETWORK_IDS } from '../../../consts'

interface EthNetworkInfoProps {
  request: Request;
  injected: {[key: string]: any};
  infoType: 'id' | 'name' | 'provider',
  element: HTMLElement
}

export const EthNetworkInfo: FunctionComponent<EthNetworkInfoProps> = (props) => { // eslint-disable-line
  const { element, injected, infoType } = props
  const { networkId, providerName } = injected

  useEffect(() => {
    try {
      if (infoType === 'id') {
        const id = networkId ?? 'Unknown'
        element.innerHTML = id
      }
      if (infoType === 'name') {
        const name = NETWORK_IDS[networkId] ?? 'Unknown'
        element.innerHTML = name
      }
      if (infoType === 'provider') {
        const provider = providerName ?? 'Unknown'
        element.innerHTML = provider
      }
    } catch (e) {
      console.log(e)
    }
  }, [ props ])

  return null
}
