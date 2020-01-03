import React, { useEffect, FunctionComponent } from 'react';
import { useGetStaticFunc } from './utils';
import { EthContractProps } from '../types';

type EthContractViewStaticProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'request' | 'injected'>
>;

export const EthContractViewStatic: FunctionComponent<
  EthContractViewStaticProps
> = ({ instance, method, element }) => {
  const { signature } = method;
  const value = useGetStaticFunc(instance, signature);

  const el = document.getElementById(element.id);
  el.innerText = value;
  el.style.color = 'blue';

  return null;
};
