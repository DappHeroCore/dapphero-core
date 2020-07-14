import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { useWeb3React } from '@web3-react/core'
import * as hooks from 'hooks'
import * as contexts from 'contexts'
import { QR, EthAddress, Card, Button, Heading, Text, Box } from 'rimble-ui'

export type ReducerProps = {
  element: HTMLElement;
  info?: any;
  domElements?: any;
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

export const Reducer: React.FunctionComponent<ReducerProps> = ({ element, info, domElements }) => {
  Modal.setAppElement(element)
  // const domElements = hooks.useDomElements()
  const ethereum = useContext(contexts.EthereumContext)
  const { chainId, networkName, providerType } = ethereum

  const PaymentAddrses = '0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A'
  let subtitle
  const [ modalIsOpen, setIsOpen ] = React.useState(false)

  function openModal(): void {
    console.log('open!')
    setIsOpen(true)
  }
  useEffect(() => {
    const trigger = document.getElementById('modal')
    element.addEventListener('click', openModal)
  }, [])

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
    <Card width="auto" maxWidth="420px" mx="auto" px={[ 3, 3, 4 ]}>
      <Heading>Heading</Heading>
      <div className="modalContainer">
        <Box>
          <QR value="0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A" />
          <Text mb={4}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam autem
      ratione doloribus quidem neque provident eius error dignissimos delectus
      architecto nemo quos alias sunt voluptate impedit, facilis sequi tempore.
      Amet!
          </Text>
        </Box>
      </div>
      <Button width={[ 1, 'auto', 'auto' ]} mr={3}>
    Accept
      </Button>

      <Button.Outline width={[ 1, 'auto', 'auto' ]} onClick={closeModal} mt={[ 2, 0, 0 ]}>
    Cancel
      </Button.Outline>
    </Card>

  </Modal>, document.getElementById('dh-apiKey'))

}
