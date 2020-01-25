import { logger } from 'logger/logger'
import { useEffect, FunctionComponent } from 'react'
import { EthereumUnits } from 'types/types'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { convertEthereumUnits } from '../../../api/ethereum/convertEthereumUnits'

interface EthUserBalanceProps {
  element: HTMLElement;
  units: EthereumUnits;
  decimals: number;
}

export const EthUserBalance: FunctionComponent<EthUserBalanceProps> = ({ element, units, decimals }) => {
  units = units ?? 'wei' //eslint-disable-line
  decimals = decimals ?? 0 //eslint-disable-line

  const { accounts, networkId, lib } = useWeb3Injected()

  useEffect(() => {
    const getData = async () => {
      try {
        if (accounts?.[0]) {
          const unformatedBalance = await lib.eth.getBalance(accounts[0])
          const formatedBalanced = Number(convertEthereumUnits(lib, unformatedBalance, 'wei', units)).toFixed(decimals)
          element.innerHTML = formatedBalanced
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [ accounts, networkId ])

  return null
}
