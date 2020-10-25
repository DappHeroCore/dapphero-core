import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { useToasts } from 'react-toast-notifications'
import * as consts from 'consts'
import * as contexts from 'contexts'
import { QR, EthAddress, Flash, Image, Card, Button, Heading, Text, Textarea, Blockie, Flex, Box } from 'rimble-ui'
import { utils } from 'ethers'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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

  const [ copied, setCopied ] = useState(false)
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
    setCopied(false)
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
    <Card width="auto" borderRadius={5} maxWidth="500px" mx="auto" p={25} px={[ 3, 3, 4 ]}>
      <Heading>Payment Address</Heading>

      <Box>
        <Text mb={4}>
        To send funds to this Ethereum address, scan this code using your mobile wallet app or click the address below to copy.
        </Text>
      </Box>
      <Flex justifyContent="center" alignContent="center">
        <Box>
          <Flex alignContent="center">
            <QR value={paymentAddress} includeMargin="true" size={200} pb="25px" />
          </Flex>
          {copied ? (
            <Flash my={1} variant="success">
Copied!
            </Flash>
          ) : <div />}
          <CopyToClipboard
            text={paymentAddress}
            onCopy={() => setCopied(true)}
          >

            <Button size="small" mainColor="#48BB78" icon="ContentPaste">{paymentAddress}</Button>
          </CopyToClipboard>
        </Box>
      </Flex>

      <Flex>
        <Box p={3} width={1 / 2}>
          <Button borderRadius={5} onClick={closeModal} width={[ 1, 'auto', 'auto' ]} mt={[ 2, 3, 3 ]}>
    Close
          </Button>

        </Box>
        <Box p={3} width={1 / 2}>
          {/* <Image
            alt="DappHero Logo"
            height="50px"
            src="https://dd7tel2830j4w.cloudfront.net/f1592171590883x194139855021717060/Recurso%202.svg"
          /> */}
        </Box>
      </Flex>
    </Card>

  </Modal>, document.getElementById('dh-apiKey'))

}
