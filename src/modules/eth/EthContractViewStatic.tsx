import React, { useEffect, useState, FunctionComponent } from 'react'
import {
  useGetStaticFunc,
  useDecimalFormatter,
  useUnitFormatter
} from './utils'
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

  let value = useGetStaticFunc(instance, signature, retVal)
  value = useUnitFormatter(injected.lib, value, unit)
  value = useDecimalFormatter(value, decimal)

  el.innerText = value

  return null
}
