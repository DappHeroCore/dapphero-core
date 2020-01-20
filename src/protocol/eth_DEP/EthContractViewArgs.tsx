import React, { useState, FunctionComponent } from 'react'
import { callPublicMethodWithArgs } from './utils'
import { EthContractProps, RequestString } from '../../types/types'
import { useUnitAndDecimalFormat } from '../../utils'

type EthContractViewArgsProps = EthContractProps

export const EthContractViewArgs: FunctionComponent<
  EthContractViewArgsProps
> = ({
  instance,
  method,
  element,
  request: { requestString },
  injected,
  signifiers,
  signifiers: { retVal, unit, decimal },
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
    retVal,
  )

  const sanitizedValue = useUnitAndDecimalFormat(injected, value, signifiers)

  element.innerText = sanitizedValue
  return null
}
