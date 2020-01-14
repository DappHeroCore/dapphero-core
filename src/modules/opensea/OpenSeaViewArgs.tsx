import React, { FunctionComponent, useEffect, useState } from 'react'
import { openSeaApi } from './api'
import { OpenSeaRequestString, OpenSeaViewProps } from './types'
import { getReturnValue } from './util'
import { useDecimalFormatter, useUnitFormatter } from '../eth/utils'

export const OpenSeaViewArgs: FunctionComponent<OpenSeaViewProps> = ({
  requestString,
  networkName,
  func,
  provider,
  signifiers,
  element,
  injected
}) => {
  const [ value, setValue ] = useState(null)

  useEffect(() => {
    const queryOpenSea = async () => {
      const args = requestString.slice(OpenSeaRequestString.ARGUMENTS)
      const resultObj = await openSeaApi(provider, func, args)

      const finalRetVal = getReturnValue(resultObj, signifiers.retVal)
      setValue(finalRetVal)
    }
    queryOpenSea()
  }, [ requestString, networkName ])

  // TODO: factor out format flow for use everywhere
  const unitFormattedVal = useUnitFormatter(injected.lib, value, signifiers.unit)
  const decimalFormattedVal = useDecimalFormatter(unitFormattedVal, signifiers.decimal)
  element.innerText = decimalFormattedVal
  return null
}
