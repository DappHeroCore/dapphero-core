import { FunctionComponent } from 'react'
import { useWeb3Injected } from '@openzeppelin/network/react'
import { addClickHandlerToTriggerElement } from '../customContract/utils'

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
  const { lib } = useWeb3Injected()

  const transferEther = (e) => {
    e.preventDefault()

    let toAddress
    let value
    const from = lib.givenProvider.selectedAddress

    inputNodes.forEach((input) => {
      const inputSplit = input.id.split('-')
      if (inputSplit[4] === 'value') value = (input as HTMLInputElement).value
      if (inputSplit[4] === 'to') toAddress = (input as HTMLInputElement).value
    })

    lib.eth.sendTransaction({ to: toAddress, from, value: lib.utils.toWei(value, 'ether') })
  }

  addClickHandlerToTriggerElement(element, transferEther)

  return null
}
