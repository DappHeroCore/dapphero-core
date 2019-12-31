import React, { useEffect, FunctionComponent } from 'react'
import { Request, dappHeroConfig } from "../types";
import ReactDOM from 'react-dom'

interface EthContractParentProps {
  request: Request;
  config: dappHeroConfig
}

export const EthContractParent:FunctionComponent<EthContractParentProps> = ({ request, config }) => {

  console.log("In the ETHCONTRACT PARENT!")
  useEffect(() => {

  }, [])

  return (
    <div>StaticContract</div>
  )
}

export default EthContractParent;