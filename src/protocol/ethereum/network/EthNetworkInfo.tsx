import { logger } from 'logger'
import { useEffect, FunctionComponent } from 'react'
import { Request, RequestString } from '../../types'
import { NETWORK_IDS } from '../../../consts'

interface EthNetworkInfoProps {
  request: Request;
  injected: {[key: string]: any};
  accounts: string[];
  infoType: 'id' | 'name' | 'provider',
  element: HTMLElement
}

export const EthNetworkInfo: FunctionComponent<EthNetworkInfoProps> = (props) => { // eslint-disable-line
  const { element, injected, infoType } = props

  useEffect(() => {
    const getData = async () => {
      try {
        if (infoType === 'id') {
          console.log('Inside ID')
          const id = await injected.lib.givenProvider.networkVersion()
          element.innerHTML = id
        }
        if (infoType === 'name') {
          const name = NETWORK_IDS[injected.lib.givenProvider.networkVersion]
          element.innerHTML = name
        }
        if (infoType === 'provider') {
          const provider = injected.providerName
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
