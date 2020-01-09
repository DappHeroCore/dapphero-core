import { useEffect, FunctionComponent } from 'react'
import { Request } from '../types'

interface EthEnableProps {
  request: Request;
  injected: {[key: string]: any}; // come back to type
  accounts: string[]; // come back to type
}

export const EthEnable: FunctionComponent<EthEnableProps> = (props) => {
  const { injected, request } = props

  const web3Enable = async () => {
    await injected.requestAuth()
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const el = document.getElementById(request.element.id)
        el.addEventListener('click', web3Enable, false)

      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [ props ])

  return null
}

export default EthEnable
