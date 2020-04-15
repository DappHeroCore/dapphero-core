import { logger } from 'logger/customLogger'
import { FunctionComponent, useMemo } from 'react'

interface EthNetworkInfoProps {
  infoValue: string;
  element: HTMLElement;
}

export const EthNetworkInfo: FunctionComponent<EthNetworkInfoProps> = ({ element, infoValue }) => { // eslint-disable-line
  const memoizedValue = useMemo(
    () => element.innerText
    , [],
  )

  if (!infoValue) {
    element.innerHTML = memoizedValue
  } else {
    element.innerHTML = infoValue
  }
  return null

  // try {
  //   element.innerHTML = infoValue
  // } catch (e) {
  //   logger.log(e)
  // }
  // return null
}
