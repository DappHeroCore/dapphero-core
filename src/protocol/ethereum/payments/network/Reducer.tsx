import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { useWeb3React } from '@web3-react/core'
import * as hooks from 'hooks'
import * as contexts from 'contexts'

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
  },
}

Modal.setAppElement(document.getElementById('modal'))

export const Reducer: React.FunctionComponent<ReducerProps> = ({ element, info, domElements }) => {
  // const domElements = hooks.useDomElements()
  const ethereum = useContext(contexts.EthereumContext)
  const { chainId, networkName, providerType } = ethereum

  let subtitle
  const [ modalIsOpen, setIsOpen ] = React.useState(false)

  function openModal(): void {
    console.log('open!')
    setIsOpen(true)
  }
  useEffect(() => {
    const trigger = document.getElementById('modal')
    trigger.addEventListener('click', openModal)
    console.log(trigger)
  }, [])

  function afterOpenModal(): void {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00'
  }

  function closeModal(): void {
    setIsOpen(false)
  }

  if (!modalIsOpen) return null

  return ReactDOM.createPortal(<div>
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >

      <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
      <button type="button" onClick={closeModal}>close</button>
      <div>I am a modal</div>
      <form>
        <input />
        <button type="button">tab navigation</button>
        <button type="button">stays</button>
        <button type="button">inside</button>
        <button type="button">the modal</button>
      </form>
    </Modal>
                               </div>, document.getElementById('dh-apiKey'))

}
