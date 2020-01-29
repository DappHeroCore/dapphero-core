import React, { useEffect, useState, FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import * as hooks from 'hooks'
import * as connectors from 'connectors'
import * as utils from 'utils'

interface PortalPayableProps {
  element: HTMLElement
}

const donateWithWeb3 = (lib, toAddress, value) => {
  const from = lib.provider.selectedAddress
  const params = [
    {
      from,
      to: toAddress,
      value: utils.convertUnits('ether', 'wei', value).toHexString(),
    },
  ]

  lib.send('eth_sendTransaction', params).then((hash) => console.log('hash:', hash))
}

function PayableElement({ text, element }) {
  const injected = hooks.useDappHeroWeb3()
  const [ , , , toAddress, value ] = element.id.split('-')

  const onClick = !injected.web3ReactContext.active
    ? injected.web3ReactContext.activate(connectors.injected)
    : () => donateWithWeb3(injected.lib, toAddress, value)

  return (
    <button // eslint-disable-line
      style={{
        border: '0',
        cursor: 'pointer',
        display: 'inline-block',
        padding: '9px 15px',
        backgroundColor: '#3898ec',
        color: 'white',
        lineHeight: 'inherit',
        textDecoration: 'none',
        borderRadius: '0',
      }}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export const PortalPayable: FunctionComponent<PortalPayableProps> = ({ element }) => {
  const injected = hooks.useDappHeroWeb3()
  const [ buttonText, setButtonText ] = useState('Connect')

  useEffect(() => {
    if (injected.connected) {
      setButtonText('Donate')
    }
  }, [ injected.web3ReactContext.active ])

  return ReactDOM.createPortal(
    <PayableElement text={buttonText} element={element} />,
    element,
  )
}
