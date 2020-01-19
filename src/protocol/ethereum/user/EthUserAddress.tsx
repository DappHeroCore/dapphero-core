import { logger } from 'logger'
import { useEffect, FunctionComponent } from 'react'
import { Request } from '../../types'
import { NETWORK_IDS } from '../../../consts'

interface EthUserInfoProps {
  request: Request;
  injected: {[key: string]: any};
  accounts: string[];
  infoType: 'address' | 'balance';
  element: HTMLElement;
}

export const EthUserAddress: FunctionComponent<EthUserInfoProps> = (props) => { // eslint-disable-line
  const { element, injected, infoType } = props
  const { accounts} = injected

  useEffect(() => {
    const getData = async () => {
      try {
        if (infoType === 'address') {
          element.innerHTML = accounts[0]
        }
      } catch (e) {
        // logger.debug(e)
      }
    }
    getData()
  }, [ props ])

  return null
}
