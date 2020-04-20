import { FunctionComponent, useEffect, useContext } from 'react'
import Notify from 'bnc-notify'
import { logger } from 'logger/customLogger'
import * as utils from 'utils'
import * as contexts from 'contexts'
import { ethers } from 'ethers'

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
  const ethereum = useContext(contexts.EthereumContext)
  const { signer, provider, isEnabled } = ethereum

  useEffect(() => {
    const transferEther = async (e) => {
      try {
        try {
          e.preventDefault()
          e.stopPropagation()
        } catch (err) {}
        // We need to get the provider details at time of sending, we can't rely on state here
        const ready = await provider.ready
        const notify = Notify({
          dappId: apiKey, // [String] The API key created by step one above
          networkId: ready.chainId, // [Integer] The Ethereum network ID your Dapp uses.
        })
        let from = null
        try {
          from = await signer.getAddress()
        } catch (error) {
          logger.warn('A write provider (signer) has not been enabled')
        }
        const inputUnits = amountObj?.modifiers_?.displayUnits ?? 'wei' // FIXME: move this to dappheroDOM
        const convertedUnits = utils.convertUnits(inputUnits, 'wei', amountObj.element.value)
        const params = [ {
          from,
          to: addressObj.element.value,
          value: ethers.utils.bigNumberify(convertedUnits).toHexString(),
          // value: utils.convertUnits(inputUnits, 'wei', amountObj.element.value),
        } ]

        if (from && isEnabled) { // We will only attempt this if we actually got our address from the signer ourslves.
          provider.send('eth_sendTransaction', params)
            .then(notify.hash)
            .catch((err) => logger.info('There was an error sending ether with metaMask', err))
            .finally(() => {
              amountObj.element.value = ''
              addressObj.element.value = ''
            })
        }
      } catch (err) {
        logger.warn('There was an error transfering ether', err)
      }
    }

    if (signer) utils.addClickHandlerToTriggerElement(element, transferEther)
  }, [ signer, isEnabled ])

  return null
}
