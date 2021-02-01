import { logger } from 'logger/customLogger'
import { useEffect, useState, useContext, FunctionComponent, useMemo, useRef } from 'react'
import { useInterval } from 'beautiful-react-hooks'
import { EthereumUnits } from 'types/types'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { useNetworkStatus } from 'react-adaptive-hooks/network'
import * as utils from 'utils'
import * as contexts from 'contexts'
import * as consts from '../../../consts'

interface EthUserBalanceProps {
  element: HTMLElement;
  units: EthereumUnits;
  decimals: number;
}

export const EthUserBalance: FunctionComponent<EthUserBalanceProps> = ({ element, units, decimals }) => {

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  const memoizedValue = useMemo(
    () => element.innerText
    , [],
  )

  // // Hook
  const useMemoCompare = (value, compare) => {
    // Ref for storing previous value
    const previousRef = useRef()
    const previous = previousRef.current

    // Pass previous and new value to compare function
    const isEqual = compare(previous, value)

    // If not equal update previous to new value (for next render)
    // and then return new new value below.
    useEffect(() => {
      if (!isEqual) {
        previousRef.current = value
      }
    })

    return isEqual ? previous : value
  }

  const initialEffectiveConnectionType = '4g'
  const { effectiveConnectionType } = useNetworkStatus(initialEffectiveConnectionType)
  units = units ?? 'wei' //eslint-disable-line
  decimals = decimals ?? 0 //eslint-disable-line

  const ethereum = useContext(contexts.EthereumContext)
  const { provider, address, isEnabled } = ethereum

  const [ balance, setBalance ] = useState(null)

  const emitBalanceValue = useMemoCompare(balance, (prev) => prev && prev._hex === balance._hex)

  // TODO: [DEV-264] Feature: NotifyJS for UserBalance polling
  const poll = async () => {
    try {
      const newBalance = await provider.getBalance(address)
      setBalance(newBalance)
    } catch (error) {
      logger.log(`Error getting balance: ${error}`)
    }
  }

  useEffect(() => {
    if (address && isEnabled) poll()
  }, [])

  useInterval(() => {
    if (address && isEnabled) poll()
  }, consts.global.AUTO_INVOKE_DYNAMIC[effectiveConnectionType])

  useEffect(() => {
    const getBalance = async (): Promise<void> => {
      try {
        const formatedBalanced = Number(utils.convertUnits('wei', units, balance)).toFixed(decimals)
        element.innerHTML = formatedBalanced
      } catch (error) {
        logger.log(`Error trying to retrieve users balance`, error)
      }
    }

    if (address && isEnabled && balance) { getBalance() } else { element.innerHTML = memoizedValue }
  }, [ address, isEnabled, balance ])

  useEffect(() => {

    emitToEvent(
      EVENT_NAMES.user.balanceStatusChange,
      { value: balance?.toString(), step: 'User balance value change', status: EVENT_STATUS.resolved },
    )

  }, [ emitBalanceValue ])

  return null
}
