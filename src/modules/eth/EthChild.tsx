import React, { Component, FunctionComponent } from 'react'
import { Request } from "../types";

interface EthChildProps {
  request: Request;
}
// export class EthChild extends Component {
//   state = {
//     state1: 1,
//     state2: 3,
//   }

//   render() {
//     return (
//       <div>
//         Some Text
//       </div>
//     )
//   }
// }

export const EthChild:FunctionComponent<EthChildProps> = ({ request }) => {
  return (
    <div>child</div>
  )
}

export default EthChild;