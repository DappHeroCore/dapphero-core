import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isMobile } from 'react-device-detect'
import * as connectors from 'connectors'
import { logger } from 'logger/customLogger'

export const useEagerConnect = () => {
  const { activate, active } = useWeb3React()

  const [ tried, setTried ] = useState(false)

  useEffect(() => {
    connectors.injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(connectors.injected, (err) => { logger.debug('isAuthorize', err) }, true).catch(() => {
          setTried(true)
        })
      } else if (
        isMobile && window.ethereum
      ) {
        activate(connectors.injected, (err) => { logger.debug('isAuthorize', err) }, true).catch(() => {
          setTried(true)
        })
      } else {
        // TODO: remove this line
        activate(connectors.injected, (err) => { logger.debug('isAuthorize', err) }, true).catch(() => {
          setTried(true)
        })
      }
    })
  }, [ activate ]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [ tried, active ])

  return tried
}
