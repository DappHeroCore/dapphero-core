import { FunctionComponent, useEffect } from 'react'
import Notify from 'bnc-notify'
import { logger } from 'logger/customLogger'
import * as hooks from 'hooks'
import * as utils from 'utils'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
interface EthTransferProps {
  element: HTMLElement
}
// TODO: [BS-16] Add feature for sending fixed amount of eth without any inputs
// TODO: [DEV-109] add blocknative support for simple eth transfers
// TODO: clean this up,
// TODO: consider adding a required unique id for this functionality
// and base DOM parsing off id
export const EthTransfer: FunctionComponent<EthTransferProps> = ({ element }) => {
  const inputNodes = document.querySelectorAll(`[id^=dh-network-transfer]`)
  const { lib } = hooks.useDappHeroWeb3()

  console.log('THE LIB COMING IN: ', lib)

  useEffect(() => {
    logger.debug('ETHTRANSFER PROVIDER', lib)
    const transferEther = (e) => {
      e.preventDefault()

      const notify = Notify({
        dappId: apiKey, // [String] The API key created by step one above
        networkId: lib._network.chainId, // [Integer] The Ethereum network ID your Dapp uses.
      })

      let toAddress
      let value
      const from = lib.provider.selectedAddress

      inputNodes.forEach((input) => {
        const inputSplit = input.id.split('-')
        if (inputSplit[4] === 'value') value = (input as HTMLInputElement).value
        if (inputSplit[4] === 'to') toAddress = (input as HTMLInputElement).value
      })
      console.log('The Value: ', utils.convertUnits('ether', 'wei', value).toHexString())

      const params = [ {
        from,
        to: toAddress,
        value: utils.convertUnits('ether', 'wei', value).toHexString(),
      } ]

      lib.send('eth_sendTransaction', params).then((hash) => notify.hash(hash))
      // lib.sendTransaction({}).catch((e) => console.log(e))
    }

    if (lib) utils.addClickHandlerToTriggerElement(element, transferEther)
  }, [ lib ])

  return null
}
