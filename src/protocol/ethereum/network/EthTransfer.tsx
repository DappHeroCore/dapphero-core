import { FunctionComponent, useEffect, useContext } from 'react'
import Notify from 'bnc-notify'
import { logger } from 'logger/customLogger'
import * as hooks from 'hooks'
import * as utils from 'utils'
import { ethers } from 'ethers'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
interface EthTransferProps {
  element: HTMLElement
  amountObj: {[key: string]: any}
  addressObj: {[key: string]: any}
  outputObj?: {[key: string]: any}
  // TODO: put correct type
  info?: {[key: string]: any}
}
// TODO: [BS-16] Add feature for sending fixed amount of eth without any inputs
// TODO: [DEV-109] add blocknative support for simple eth transfers
// TODO: clean this up,
// TODO: consider adding a required unique id for this functionality
// and base DOM parsing off id
export const EthTransfer: FunctionComponent<EthTransferProps> = ({ element, amountObj, addressObj, outputObj, info }) => {
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
      const inputUnits = amountObj?.modifiers_?.input_units ?? 'wei' // FIXME: move this to dappheroDOM
      const convertedUnits = utils.convertUnits(inputUnits, 'wei', amountObj.element.value)
      const params = [ {
        from,
        to: addressObj.element.value,
        value: ethers.utils.bigNumberify(convertedUnits).toHexString(),
        // value: utils.convertUnits(inputUnits, 'wei', amountObj.element.value),
      } ]

      lib.send('eth_sendTransaction', params)
        .then((hash) => notify.hash(hash))
    }

    if (lib) utils.addClickHandlerToTriggerElement(element, transferEther)
  }, [ lib ])

  return null
}
