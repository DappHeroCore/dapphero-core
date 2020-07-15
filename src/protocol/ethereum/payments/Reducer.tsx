import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { useToasts } from 'react-toast-notifications'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { QR, EthAddress, Card, Button, Heading, Text, Textarea, Blockie, Flex, Box } from 'rimble-ui'
import { utils } from 'ethers'

export type ReducerProps = {
  element: HTMLElement;
  info?: any;
  domElements?: any;
  paymentAddress?: string;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    border: '0px solid #ccc',
    outline: 'none',
    boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.09)',
  },
}

export const Reducer: React.FunctionComponent<ReducerProps> = ({ element, info, domElements, paymentAddress }) => {
  const { addToast } = useToasts()

  Modal.setAppElement(element)
  // const domElements = hooks.useDomElements()
  const ethereum = useContext(contexts.EthereumContext)
  const { chainId, networkName, providerType } = ethereum

  let subtitle
  const [ modalIsOpen, setIsOpen ] = React.useState(false)

  function isAddress(address) {
    try {
      utils.getAddress(address)
    } catch (error) {
      return false
    }
    return true
  }

  function openModal(e): void {
    e.preventDefault()
    if (paymentAddress && isAddress(paymentAddress)) {
      setIsOpen(true)
    } else {
      addToast(
        'No Payment address set.',
        { appearance: 'info', autoDismiss: true, autoDismissTimeout: consts.global.REACT_TOAST_AUTODISMISS_INTERVAL },
      )
    }
  }
  useEffect(() => {
    element.addEventListener('click', openModal)
  }, [ paymentAddress ])

  function afterOpenModal(): void {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00'
  }

  function closeModal(): void {
    setIsOpen(false)
  }

  if (!modalIsOpen) return null

  return ReactDOM.createPortal(<Modal
    isOpen={modalIsOpen}
    onAfterOpen={afterOpenModal}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel="Example Modal"
  >
    <div ref={(_subtitle) => (subtitle = _subtitle)} />
    <Card width="auto" maxWidth="420px" mx="auto" p={25} px={[ 3, 3, 4 ]}>
      <Heading>Payment Address</Heading>

      <Box>
        <Text mb={4}>
        To send funds to this Ethereum address, scan this code using your mobile wallet app
        </Text>
      </Box>

      <Flex>
        <Card width="auto" maxWidth="400px" mx="auto" px={[ 3, 3, 4 ]}>
          <QR value={paymentAddress} />
        </Card>
      </Flex>
      <Flex>
        <Text.p fontSize={1} m={20}>{paymentAddress}</Text.p>
      </Flex>
      <Button.Outline onClick={closeModal} width={[ 1, 'auto', 'auto' ]} mt={[ 2, 3, 3 ]}>
    Close
      </Button.Outline>
    </Card>

  </Modal>, document.getElementById('dh-apiKey'))

}
