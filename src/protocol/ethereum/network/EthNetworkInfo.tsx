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

  element.innerHTML = infoValue || memoizedValue
  return null
}
