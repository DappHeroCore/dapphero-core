import { logger } from 'logger/customLogger'
import { useEffect, useState, useContext, FunctionComponent, useMemo } from 'react'
import { useInterval } from 'beautiful-react-hooks'
import { EthereumUnits } from 'types/types'
import * as utils from 'utils'
import * as contexts from 'contexts'
import * as consts from '../../../consts'

interface EthUserBalanceProps {
  element: HTMLElement;
  units: EthereumUnits;
  decimals: number;
}

export const EthUserBalance: FunctionComponent<EthUserBalanceProps> = ({ element, units, decimals }) => {
  const memoizedValue = useMemo(
    () => element.innerText
    , [],
  )

  units = units ?? 'wei' //eslint-disable-line
  decimals = decimals ?? 0 //eslint-disable-line

  const ethereum = useContext(contexts.EthereumContext)
  const { provider, address, isEnabled } = ethereum

  const [ balance, setBalance ] = useState(null)

  // TODO: [DEV-264] Feature: NotifyJS for UserBalance polling
  useInterval(() => {
    const poll = async () => {
      try {
        const balance = await provider.getBalance(address)
        setBalance(balance)
      } catch (error) {
        logger.log(`Error getting balance: ${error}`)
      }
    }
    if (address && isEnabled) poll()
  }, consts.global.AUTO_INVOKE_INTERVAL)

  useEffect(() => {
    const getBalance = async (): Promise<void> => {
      try {
        const formatedBalanced = Number(utils.convertUnits('wei', units, balance)).toFixed(decimals)
        element.innerHTML = formatedBalanced
      } catch (error) {
        logger.log(`Error trying to retrieve users balance`, error)
      }
    }

    if (address && isEnabled) { getBalance() } else { element.innerHTML = memoizedValue }
  }, [ address, isEnabled, balance ])

  return null
}
