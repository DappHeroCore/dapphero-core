import React, { useEffect, FunctionComponent } from 'react'
import { Request, dappHeroConfig } from "../types";
import ReactDOM from 'react-dom'

interface EthContractParentProps {
  request: Request;
  config: dappHeroConfig
}

export const EthContractParent:FunctionComponent<EthContractParentProps> = ({ request, config }) => {
  useEffect(() => {

  }, [])

  return (
    <div>StaticContract</div>
  )
}

export default EthContractParent;