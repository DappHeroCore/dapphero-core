import { FunctionComponent, useEffect } from 'react'
import * as hooks from 'hooks'
import * as utils from 'utils'

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

  useEffect(() => {
    console.log('ETHTRANSFER PROVIDER', lib)
    const transferEther = (e) => {
      e.preventDefault()

      let toAddress
      let value
      const from = lib.provider.selectedAddress

      inputNodes.forEach((input) => {
        const inputSplit = input.id.split('-')
        if (inputSplit[4] === 'value') value = (input as HTMLInputElement).value
        if (inputSplit[4] === 'to') toAddress = (input as HTMLInputElement).value
      })

      lib.sendTransaction({ to: toAddress, from, value: utils.convertUnits('ether', 'wei', value) }).catch((e) => console.log(e))
    }

    if (lib) utils.addClickHandlerToTriggerElement(element, transferEther)
  }, [ lib ])

  return null
}
