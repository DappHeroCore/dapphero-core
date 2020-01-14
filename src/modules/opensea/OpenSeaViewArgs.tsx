import React, { FunctionComponent, useEffect, useState } from 'react';
import { openSeaApi } from './api';
import { OpenSeaRequestString, OpenSeaViewProps } from './types';
import { getReturnValue } from './util'

export const OpenSeaViewArgs: FunctionComponent<OpenSeaViewProps> = ({
  requestString,
  networkName,
  func,
  provider,
  signifiers,
  element
}) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const queryOpenSea = async () => {
      const args = requestString.slice(OpenSeaRequestString.ARGUMENTS)
      const resultObj = await openSeaApi(provider, func, args)
        
      // TODO: add format and decimals
      const finalRetVal = getReturnValue(resultObj, signifiers.retVal)
      setValue(finalRetVal)
    };
    queryOpenSea();
  }, [requestString, networkName]);

  element.innerText = value;
  return null;
};
