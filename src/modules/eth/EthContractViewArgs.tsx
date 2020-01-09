import React, { useEffect, useState, FunctionComponent } from 'react'
import { callPublicMethodWithArgs, useDecimalFormatter, useUnitFormatter } from './utils'
import { EthContractProps, Signifiers, RequestString } from '../types'

type EthContractViewArgsProps = EthContractProps

export const EthContractViewArgs: FunctionComponent<
  EthContractViewArgsProps
> = ({
  instance,
  method,
  element,
  request: { requestString },
  injected,
  signifiers: { retVal, unit, decimal }
}) => {
  const { signature } = method
  const [ value, setValue ] = useState(null)

  const args = requestString.slice(RequestString.ETH_CONTRACT_ARGS)
  const sanitizedArgs = args.map((arg) => (arg === 'user' ? injected.accounts[0] : arg))

  callPublicMethodWithArgs(
    injected,
    instance,
    signature,
    sanitizedArgs,
    setValue,
    retVal
  )

  let sanitizedValue = useUnitFormatter(injected.lib, value, unit)
  sanitizedValue = useDecimalFormatter(sanitizedValue, decimal)

  element.innerText = sanitizedValue
  return null
}
