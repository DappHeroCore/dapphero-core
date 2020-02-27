import { logger } from 'logger/customLogger'
import { useEffect, FunctionComponent } from 'react'
import { EthereumUnits } from 'types/types'
import * as utils from 'utils'
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

  // const { accounts, networkId, lib } = hooks.useDappHeroWeb3()
  const { account, chainId, library } = useWeb3React()

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        if (account) {
          const unformatedBalance = await library.getBalance(account)
          const formatedBalanced = Number(utils.convertUnits('wei', units, unformatedBalance)).toFixed(decimals)
          element.innerHTML = formatedBalanced
        }
      } catch (e) {
        logger.log('Get Balance in the USER feature set Failed', e)
      }
    }
    getData()
    const intervalId = setInterval(getData, POLLING_INTERVAL)
    return (): void => { clearInterval(intervalId) }
  }, [ account, chainId ])

  return null
}
