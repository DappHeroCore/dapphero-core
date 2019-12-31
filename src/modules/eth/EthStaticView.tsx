import React, { useEffect, FunctionComponent } from 'react'
import { Request } from "../types";
import ReactDOM from 'react-dom'

interface EthStaticViewProps {
  request: Request;
}

export const EthStaticView:FunctionComponent<EthStaticViewProps> = ({ request }) => {
  useEffect(() => {

  }, [])

  return (
    <div>StaticView</div>
  )
}

export default EthStaticView;