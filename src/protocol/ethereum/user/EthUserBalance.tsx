import { logger } from 'logger/customLogger'
import { useEffect, FunctionComponent } from 'react'
import { EthereumUnits } from 'types/types'
import * as hooks from 'hooks'
import * as utils from 'utils'
import { useWeb3React } from '@web3-react/core'

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
    const getData = async () => {
      try {
        if (account) {
          const unformatedBalance = await library.getBalance(account)
          const formatedBalanced = Number(utils.convertUnits('wei', units, unformatedBalance)).toFixed(decimals)
          element.innerHTML = formatedBalanced
        }
      } catch (e) {
        logger.log('Get Balance Failed', e)
      }
    }
    getData()
  }, [ account, chainId ])

  return null
}
