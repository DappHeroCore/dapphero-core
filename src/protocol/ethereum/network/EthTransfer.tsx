import { FunctionComponent, useEffect, useContext } from 'react'
import Notify from 'bnc-notify'
import { logger } from 'logger/customLogger'
import * as hooks from 'hooks'
import * as utils from 'utils'
import { DomElementsContext } from 'contexts'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
interface EthTransferProps {
  element: HTMLElement
  amountNode: HTMLInputElement
  addressNode: HTMLInputElement
  outputNode?: HTMLElement
  amountUnits?: 'ether' | 'wei'
  // TODO: put correct type
  info?: any
}
// TODO: [BS-16] Add feature for sending fixed amount of eth without any inputs
// TODO: [DEV-109] add blocknative support for simple eth transfers
// TODO: clean this up,
// TODO: consider adding a required unique id for this functionality
// and base DOM parsing off id
export const EthTransfer: FunctionComponent<EthTransferProps> = ({ element, amountNode, addressNode, outputNode, info, amountUnits }) => {
  console.log('TCL: info', info)
  const { lib } = hooks.useDappHeroWeb3()
  // const DomElementContext = useContext(DomElementsContext)

  useEffect(() => {
    const transferEther = (e) => {
      e.preventDefault()

      const notify = Notify({
        dappId: apiKey, // [String] The API key created by step one above
        networkId: lib._network.chainId, // [Integer] The Ethereum network ID your Dapp uses.
      })

      const from = lib.provider.selectedAddress

      const params = [ {
        from,
        to: addressNode.value,
        value: utils.convertUnits('ether', 'wei', amountNode.value).toHexString(),
      } ]

      lib.send('eth_sendTransaction', params).then((hash) => notify.hash(hash))
      // lib.sendTransaction({}).catch((e) => console.log(e))
    }

    if (lib) utils.addClickHandlerToTriggerElement(element, transferEther)
  }, [ lib ])

  return null
}
