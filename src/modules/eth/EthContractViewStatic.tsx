import React, { useEffect, FunctionComponent } from 'react'
import { useGetStaticFunc } from './utils'
import { EthContractProps } from '../types'

type EthContractViewStaticProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'request' | 'injected'>
> & {
  identifiedReturnValue?: string | null
}

export const EthContractViewStatic: FunctionComponent<
  EthContractViewStaticProps
> = ({ instance, method, element, identifiedReturnValue }) => {
  const { signature } = method
  const value = useGetStaticFunc(instance, signature, identifiedReturnValue)

  console.log('ETHCONTRACTVIEWSTATIC: method', method)
  console.log('ETHCONTRACTVIEWSTATIC: element', element)
  console.log('ETHCONTRACTVIEWSTATIC: value', value)

  const el = document.getElementById(element.id)
  el.innerText = value
  el.style.color = 'blue'

  return null
}
