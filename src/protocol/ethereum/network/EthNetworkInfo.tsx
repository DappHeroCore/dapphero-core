import { logger } from 'logger'
import { useEffect, FunctionComponent } from 'react'
import { Request } from '../../types'
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
    const getData = async () => {
      try {
        if (infoType === 'id') {
          const id = networkId
          element.innerHTML = id
        }
        if (infoType === 'name') {
          const name = NETWORK_IDS[networkId]
          element.innerHTML = name
        }
        if (infoType === 'provider') {
          const provider = providerName
          element.innerHTML = provider
        }
      } catch (e) {
        // logger.debug(e)
      }
    }
    getData()
  }, [ props ])

  return null
}
