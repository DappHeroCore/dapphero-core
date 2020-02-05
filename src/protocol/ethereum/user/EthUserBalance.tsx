import { logger } from 'logger/customLogger'
import { useEffect, FunctionComponent } from 'react'
import { EthereumUnits } from 'types/types'
import * as hooks from 'hooks'
import * as utils from 'utils'

interface EthUserBalanceProps {
  element: HTMLElement;
  units: EthereumUnits;
  decimals: number;
}

export const EthUserBalance: FunctionComponent<EthUserBalanceProps> = ({ element, units, decimals }) => {
  units = units ?? 'wei' //eslint-disable-line
  decimals = decimals ?? 0 //eslint-disable-line

  const { accounts, networkId, lib } = hooks.useDappHeroWeb3()

  useEffect(() => {
    const getData = async () => {
      try {
        if (accounts?.[0]) {
          const unformatedBalance = await lib.getBalance(accounts[0])
          const formatedBalanced = Number(utils.convertUnits('wei', units, unformatedBalance)).toFixed(decimals)
          element.innerHTML = formatedBalanced
        }
      } catch (e) {
        logger.debug('Get Balance Failed', e)
      }
    }
    getData()
  }, [ accounts, networkId ])

  return null
}
