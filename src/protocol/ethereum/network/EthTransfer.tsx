import { FunctionComponent, useEffect, useContext } from 'react'
import Notify from 'bnc-notify'
import { logger } from 'logger/customLogger'
import * as utils from 'utils'
import * as contexts from 'contexts'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

const apiKey = process.env.REACT_APP_BLOCKNATIVE_API
interface EthTransferProps {
  element: HTMLElement;
  amountObj: {[key: string]: any};
  addressObj: {[key: string]: any};
  outputObj?: {[key: string]: any};
  // TODO: put correct type
  info?: {[key: string]: any};
}

export const EthTransfer: FunctionComponent<EthTransferProps> = ({ element, amountObj, addressObj, outputObj, info }) => {
  const { library } = useWeb3React()

  const ethereum = useContext(contexts.EthereumContext)
  const { chainId, signer, writeProvider } = ethereum

  useEffect(() => {
    const transferEther = async (e) => {
      try {
        try {
          e.preventDefault()
          e.stopPropagation()
        } catch (err) {}
        const notify = Notify({
          dappId: apiKey, // [String] The API key created by step one above
          networkId: chainId.chainId, // [Integer] The Ethereum network ID your Dapp uses.
        })

        const from = await signer.getAddress()
        console.log('transferEther -> from', from)
        const inputUnits = amountObj?.modifiers_?.displayUnits ?? 'wei' // FIXME: move this to dappheroDOM
        const convertedUnits = utils.convertUnits(inputUnits, 'wei', amountObj.element.value)
        console.log('transferEther -> convertedUnits', convertedUnits)
        const params = [ {
          from,
          to: addressObj.element.value,
          value: ethers.utils.bigNumberify(convertedUnits).toHexString(),
          // value: utils.convertUnits(inputUnits, 'wei', amountObj.element.value),
        } ]

        const { ethereum: ethereum2 } = window
        // Request account access if needed
        await ethereum2.enable()
        const provider = new ethers.providers.Web3Provider(ethereum2)

        provider.sendTransaction('eth_sendTransaction', params)
          .then((hash) => {
            notify.hash(hash)
            amountObj.element.value = ''
            addressObj.element.value = ''
          })
          .catch((err) => {
            amountObj.element.value = ''
            addressObj.element.value = ''
            console.log('THE SEND ERROR', err)
            logger.info('There was an error sending ether with metaMask', err)
          })
      } catch (err) {
        console.log('What is the error: ', err)
        logger.warn('There was an error transfering ether', err)
      }
    }

    if (signer) utils.addClickHandlerToTriggerElement(element, transferEther)
  }, [ signer ])

  return null
}
