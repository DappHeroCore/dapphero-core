import React, { FunctionComponent } from 'react'
import { useGetStaticFunc } from './utils'
import { EthContractProps } from '../types'
import { useUnitAndDecimalFormat } from '../utils'

type EthContractViewStaticProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'request'>
>;

export const EthContractViewStatic: FunctionComponent<
  EthContractViewStaticProps
> = ({
  instance,
  method,
  element,
  signifiers,
  signifiers: { retVal, unit, decimal },
  injected,
}) => {
  const { signature } = method
  const el = document.getElementById(element.id)

  const staticReturnValue = useGetStaticFunc(instance, signature, retVal)
  const formattedValue = useUnitAndDecimalFormat(injected, staticReturnValue, signifiers)

  el.innerText = formattedValue

  return null
}
