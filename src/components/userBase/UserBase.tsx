import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement')

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

export const UserBase = ({ db }) => {
  let subtitle

  const [ modalIsOpen, setIsOpen ] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (window.dappHero) {
      // window.dappHero.db = db
      window.dappHero.openModal = openModal
      window.dappHero.closeModal = closeModal
    }
  }, [ window.dappHero, db ])

  return (
    <div>
      <button type="button" onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={null}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        {/* <h2 ref={(_subtitle): VoidFunction => (subtitle = _subtitle)}>Hello</h2> */}
        <button type="button" onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button type="button">tab navigation</button>

        </form>
      </Modal>
    </div>
  )
}

