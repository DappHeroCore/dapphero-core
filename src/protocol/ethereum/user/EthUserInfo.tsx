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

export const EthUserInfo: FunctionComponent<EthUserInfoProps> = (props) => { // eslint-disable-line
  const { element, injected, infoType } = props
  const { accounts, lib } = injected

  console.log("in EthUserInfo: ", props)
  useEffect(() => {
    const getData = async () => {
      try {
        if (infoType === 'balance') {
          const name = await lib.eth.getBalance(accounts[0])
          element.innerHTML = name
        }
      } catch (e) {
        // logger.debug(e)
      }
    }
    getData()
  }, [ props ])

  return null
}
