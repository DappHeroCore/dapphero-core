import React, { useEffect, useState, FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import * as hooks from 'hooks'
import * as connectors from 'connectors'
import * as utils from 'utils'

interface PortalUniswapProps {
  element: HTMLElement
}

function IFrameElement({ outputCurrency }) {
  return (
    <iframe
      src={`https://uniswap.exchange/swap?outputCurrency=${outputCurrency}`}
      height="660px"
      width="100%"
      style={{
        border: '0',
        margin: '0 auto',
        display: 'block',
        borderRadius: '10px',
        maxWidth: '600px',
        minWidth: '300px',
      }}
      title="uniswap-iframe"
    />
  )
}

export const PortalUniswap: FunctionComponent<PortalUniswapProps> = ({ element }) => {
  const [ , , , outputCurrency ] = element.id.split('-')

  return ReactDOM.createPortal(
    <IFrameElement outputCurrency={outputCurrency} />,
    element,
  )
}
