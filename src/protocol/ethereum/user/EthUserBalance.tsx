import { logger } from 'logger/customLogger'
import { useEffect, useState, useContext, FunctionComponent } from 'react'
import { EthereumUnits } from 'types/types'
import * as utils from 'utils'
import * as contexts from 'contexts'

import { useWeb3React } from '@web3-react/core'

const POLLING_INTERVAL = 1000

interface EthUserBalanceProps {
  element: HTMLElement;
  units: EthereumUnits;
  decimals: number;
}

export const EthUserBalance: FunctionComponent<EthUserBalanceProps> = ({ element, units, decimals }) => {
  units = units ?? 'wei' //eslint-disable-line
  decimals = decimals ?? 0 //eslint-disable-line

  const [ data, setData ] = useState({ address: null, balance: null })

  const ethereum = useContext(contexts.EthereumContext)
  const { provider, address } = ethereum

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
    if (provider) getBalance()

  }, [ provider.ready ])

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        if (data?.address) {
          const formatedBalanced = Number(utils.convertUnits('wei', units, data.balance)).toFixed(decimals)
          element.innerHTML = formatedBalanced
        }
      } catch (e) {
        logger.log('Get Balance in the USER feature set Failed', e)
      }
    }
    getData()
    const intervalId = setInterval(getData, POLLING_INTERVAL)
    return (): void => { clearInterval(intervalId) }
  }, [ provider, address ])

  return null
}
