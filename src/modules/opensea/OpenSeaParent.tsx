import React, { FunctionComponent, useEffect } from 'react';
import { OpenSeaViewArgs } from './OpenSeaViewArgs';
import { OpenSeaViewArgsList } from './OpenSeaViewArgsList';
import { EthContractProps } from '../types';
import { OpenSeaFunctions, OpenSeaRequestString } from './types'

type OpenSeaParentProps = Pick<
  EthContractProps,
  Exclude<keyof EthContractProps, 'method' | 'instance'> 
>;

const OPENSEA_SUPPORTED_NETWORKS = ['Main', 'Rinkeby']

export const OpenSeaParent: FunctionComponent<OpenSeaParentProps> = ({
  injected,
  signifiers,
  request: { requestString },
  element
}) => { 
  if(!OPENSEA_SUPPORTED_NETWORKS.includes(injected.networkName)) return null

  const func = requestString[OpenSeaRequestString.FUNCTION]

  switch (func) {
    case OpenSeaFunctions.RETRIEVE_ASSET:{
      return (
        <OpenSeaViewArgs
          requestString={requestString}
          networkName={injected.networkName}
          provider={injected.lib._provider}
          func={func}
          signifiers={signifiers}
          element={element}
        />
      );
      break;
    }

    case OpenSeaFunctions.RETRIEVE_ASSETS_BY_OWNER: {
      return (
        <OpenSeaViewArgsList 
          requestString={requestString}
          networkName={injected.networkName}
          provider={injected.lib._provider}
          func={func}
          signifiers={signifiers}
          element={element}
        />
      )
    }

    default: {
      return null
    }
  }

  return null;
};
