import React, { useEffect, useState, FunctionComponent } from 'react'
import { callPublicMethodWithArgs } from './utils/callPublicMethodWithArg'
import { EthContractProps, Signifiers } from '../types'

type EthContractViewArgsProps = EthContractProps & {
  identifiedReturnValue: string | undefined;
};

export const EthContractViewArgs: FunctionComponent<
  EthContractViewArgsProps
> = ({
  instance,
  method,
  element,
  request: { requestString },
  injected,
  identifiedReturnValue
}) => {
  const { signature } = method
  const [ value, setValue ] = useState(null)

  const pointerIndex = 3 // this is where args begin

  const args = requestString.slice(pointerIndex + 1)
  const sanitizedArgs = []
  args.forEach((arg, i) => {
    if (arg === 'user') {
      sanitizedArgs.push(injected.accounts[0])
    } else if (arg.startsWith(Signifiers.IDENTIFY_RETURN_VALUE)) {
      // do nothing: this is the return signifier
    } else {
      sanitizedArgs.push(arg)
    }
  })
  // TODO: add to util function file? ^

  callPublicMethodWithArgs(
    instance,
    signature,
    sanitizedArgs,
    setValue,
    identifiedReturnValue
  )

  element.innerText = value
  element.style.color = 'blue'
  return null
}
