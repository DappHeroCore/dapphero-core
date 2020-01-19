import { logger } from 'logger/logger'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from '../../../api/openSea'
import { OpenSeaRequestString, OpenSeaViewProps } from './types'
import { useUnitAndDecimalFormat, getReturnValueWithCopyPath } from '../../../utils'

export const OpenSeaViewArgs: FunctionComponent<OpenSeaViewProps> = ({
  requestString,
  networkName,
  func,
  provider,
  signifiers,
  element,
  injected,
}) => {
  const [ value, setValue ] = useState(null)

  console.log('here')
  useEffect(() => {
    const queryOpenSea = async () => {
      const args = requestString.slice(OpenSeaRequestString.ARGUMENTS)
      const resultObj = await openSeaApi(provider, func, args)

      const finalRetVal = getReturnValueWithCopyPath(resultObj, signifiers.retVal)
      setValue(finalRetVal)
    }

    queryOpenSea()

  }, [ requestString, networkName ])

  // TODO: factor out format flow for use everywhere
  const formattedValue = useUnitAndDecimalFormat(injected, value, signifiers)
  element.innerText = formattedValue
  return null
}
