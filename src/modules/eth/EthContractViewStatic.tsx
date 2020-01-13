import React, { FunctionComponent } from 'react'
import { useGetStaticFunc, useDecimalFormatter, useUnitFormatter } from './utils'
import { EthContractProps } from '../types'

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
  signifiers: { retVal, unit, decimal },
  injected
}) => {
  const { signature } = method
  const el = document.getElementById(element.id)

  const staticReturnValue = useGetStaticFunc(instance, signature, retVal)
  const formattedReturnValue = useUnitFormatter(injected.lib, staticReturnValue, unit)
  const finalValueWithDecimalFormatting = useDecimalFormatter(formattedReturnValue, decimal)

  el.innerText = finalValueWithDecimalFormatting

  return null
}
