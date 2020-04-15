import { logger } from 'logger/customLogger'
import { useEffect, useState, useContext, FunctionComponent, useMemo } from 'react'
import { EthereumUnits } from 'types/types'
import * as utils from 'utils'
import * as contexts from 'contexts'

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

  const [ data, setData ] = useState({ address: null, balance: null })

  const ethereum = useContext(contexts.EthereumContext)
  const { provider, address, isEnabled } = ethereum

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getBalance = async () => {
      try {
        const balance = await provider.getBalance(address)
        setData({ address, balance })
      } catch (error) {
        logger.log(`Error trying to retrieve users balance`, error)
      }
    }
    if (isEnabled) getBalance()

  }, [ provider.ready ])

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        if (data?.address && isEnabled) {
          const formatedBalanced = Number(utils.convertUnits('wei', units, data.balance)).toFixed(decimals)
          element.innerHTML = formatedBalanced
        } else {
          element.innerHTML = memoizedValue
        }
      } catch (e) {
        logger.log('Format Balance in the USER feature set Failed', e)
      }
    }
    getData()
  }, [ provider, address ])

  return null
}
