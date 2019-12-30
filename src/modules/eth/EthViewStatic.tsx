import React, { useEffect, FunctionComponent } from 'react'
import { Request } from "../types";

interface EthChildProps {
  request: Request;
}

export const EthChild:FunctionComponent<EthChildProps> = ({ request }) => {
  useEffect(() => {

  }, [])

  return (
    <div>child</div>
  )
}

export default EthChild;