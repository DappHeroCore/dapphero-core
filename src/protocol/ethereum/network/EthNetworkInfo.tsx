import { logger } from 'logger/logger'
import { FunctionComponent } from 'react'

interface EthNetworkInfoProps {
  infoValue: string,
  element: HTMLElement
}

export const EthNetworkInfo: FunctionComponent<EthNetworkInfoProps> = ({ element, infoValue }) => { // eslint-disable-line
  try {
    element.innerHTML = infoValue
  } catch (e) {
    console.log(e)
  }
  return null
}
