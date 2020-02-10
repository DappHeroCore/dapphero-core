import { logger } from 'logger/customLogger'
import { FunctionComponent } from 'react'

interface EthNetworkInfoProps {
  infoValue: string;
  element: HTMLElement;
}

export const EthNetworkInfo: FunctionComponent<EthNetworkInfoProps> = ({ element, infoValue }) => { // eslint-disable-line
  try {
    element.innerHTML = infoValue
  } catch (e) {
    logger.log(e)
  }
  return null
}
