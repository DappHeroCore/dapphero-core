import React, { FunctionComponent, useEffect, useState } from 'react';
import { openSeaApi } from './api';
import { OpenSeaRequestString, OpenSeaViewProps } from './types';
import { getReturnValue } from './util';

export const OpenSeaViewArgsList: FunctionComponent<OpenSeaViewProps> = ({
  requestString,
  networkName,
  func,
  provider,
  signifiers,
  element
}) => {
  const [list, setList] = useState([]);
  console.log('signifiers', signifiers);

  useEffect(() => {
    const queryOpenSea = async () => {
      const args = requestString.slice(OpenSeaRequestString.ARGUMENTS);
      const resultObj = await openSeaApi(provider, func, args);
      const assets = (resultObj as any).assets;
      setList((resultObj as any).assets);

      // TODO: add format and decimals

      const elements = Array.prototype.slice.call(
        document.querySelectorAll(`[id^=${signifiers.childElement}]`)
      );

      assets.forEach((item, i) => {
        const parent = document.createElement('div');
        elements.forEach((el, i) => {
          const node = el.cloneNode(true);
          const copyPath = el.id.split('-')[1].slice(1);
          const retVal = getReturnValue(item, copyPath);
          node.innerText = retVal;
          parent.appendChild(node);
        });
        element.appendChild(parent);
      });

      elements.forEach(el => (el.style.display = 'none'));
    };
    queryOpenSea();
  }, [requestString, networkName]);

  return null;
};
