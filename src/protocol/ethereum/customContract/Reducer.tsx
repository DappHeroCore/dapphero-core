import React, { useState, useContext, useEffect, useReducer } from 'react'
import { useToasts } from 'react-toast-notifications'
import { logger } from 'logger/customLogger'
import { useNetworkStatus } from 'react-adaptive-hooks/network'

import * as consts from 'consts'
import * as contexts from 'contexts'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'

import { useAddInvokeTrigger } from './useAddInvokeTrigger'
import { useAutoInvokeMethod } from './useAutoInvokeMethod'
import { useDisplayResults } from './useDisplayResults'
import { stateReducer, ACTION_TYPES, dsp } from './stateMachine'

import { sendTx } from './sendTx'
import { callMethod } from './callMethod'

import { notify, getParametersFromInputValues, findReplaceOverloadedMethods } from './utils/utils'

const blockNativeApiKey = process.env.REACT_APP_BLOCKNATIVE_API

export type ReducerProps = {
  info: any;
  readContract: any;
  writeContract: any;
  readEnabled: any;
  readChainId: any;
  writeEnabled: any;
  timestamp: number;
  contractAbi: any;
}
// Reducer Component
export const Reducer: React.FunctionComponent<ReducerProps> = ({ info, readContract, writeContract, readEnabled, readChainId, writeEnabled, timestamp, contractAbi }) => {

  const initialEffectiveConnectionType = '4g'
  const { effectiveConnectionType } = useNetworkStatus(initialEffectiveConnectionType)
  const POLLING_INTERVAL = consts.global.AUTO_INVOKE_DYNAMIC[effectiveConnectionType]

  const [ state, dispatch ] = useReducer(stateReducer, {})

  const {
    childrenElements,
    properties,
    hasInputs,
    isTransaction,
  } = info

  // TODO Check for Overloaded Functions
  const autoInvokeKey = properties.find(({ key }) => key === 'autoInvoke')
  const methodNameKey = properties.find(({ key }) => key === 'methodName')
  const ethValueKey = properties.find((property) => property.key === 'ethValue')

  const ethValue = ethValueKey?.value
  const { value: methodName } = methodNameKey

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  // Create a write Provider from the injected ethereum context
  const { provider, isEnabled, chainId, address } = useContext(contexts.EthereumContext)

  // Toast Notifications
  const { addToast } = useToasts()

  // React hooks
  const [ result, setResult ] = useState(null)
  const [ autoInterval, setAutoInterval ] = useState(null)

  // Stop AutoInvoke if the call is not working
  useEffect(() => {
    if (autoInterval && state.error) {
      clearInterval(autoInterval)
      emitToEvent(
        EVENT_NAMES.contract.statusChange,
        { value: state.error, step: 'Auto invoke method', status: EVENT_STATUS.rejected, methodNameKey },
      )
    }
  }, [ autoInterval, state.error ])

  // Display Error Messages
  useEffect(() => {
    const { msg, error, info: stateInfo } = state
    if (error) {
      logger.error(msg, error)
      addToast(msg, { appearance: 'error', autoDismiss: true, autoDismissTimeout: consts.global.REACT_TOAST_AUTODISMISS_INTERVAL })
    }

    if (stateInfo) {
      logger.info(msg, stateInfo)
      addToast(msg, { appearance: 'info', autoDismiss: true, autoDismissTimeout: consts.global.REACT_TOAST_AUTODISMISS_INTERVAL })
    }
  }, [ state.error, state.info ])

  // Return values to their orignal value when unmounted
  useEffect(() => {
    let rawValues = []

    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
    const getOriginalValues = () => {
      const [ inputs ] = inputChildrens
      rawValues = inputs.element.map(({ element }) => ({ element, rawValue: element.value }))
    }

    if (inputChildrens.length) getOriginalValues()
    return (): void => {
      for (const el of rawValues) {
        el.element.value = el.rawValue
      }
      return null
    }

  }, [])

  // -> Handlers
  const handleRunMethod = async (event = null, isPolling = false): Promise<void> => {
    if (event) {
      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (err) { }
    }
    // Return early if the read and write instances aren't ready
    // if (!readEnabled && !writeEnabled) return null

    emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: null, step: 'Getting and parsing parameters.', status: EVENT_STATUS.pending, methodNameKey },
    )

    const { parametersValues, newEthValue } = getParametersFromInputValues({ info, methodName, dispatch, address, methodNameKey, ethValue })

    emitToEvent(
      EVENT_NAMES.contract.statusChange,
      { value: parametersValues, step: 'Getting and parsing parameters.', status: EVENT_STATUS.resolved, methodNameKey },
    )

    if (hasInputs) {
      const isParametersFilled = Boolean(parametersValues.filter(Boolean).join(''))
      if (!isParametersFilled) {
        dispatch({
          type: ACTION_TYPES.parametersUndefined,
          status: {
            error: false,
            fetching: false,
            msg: `There appear to be no parameters provided.`,
          },
        })
      } // TODO: Add Dispatch for State instead of Console.error
    }

    // Figure out if method is overloaded and which method we should call in that case.
    const correctedMethodName = findReplaceOverloadedMethods({ methodName, contractAbi, parametersValues })

    // If this is a transaction, but we don't have a write provider, you can stop here.
    if (isTransaction && !writeEnabled) {
      dsp.txFlow.txNoWriteProviderEnabled({ dispatch })
      emitToEvent(
        EVENT_NAMES.contract.statusChange,
        { value: parametersValues, step: 'No write provider enabled.', status: EVENT_STATUS.resolved, methodNameKey },
      )
      return null
    }

    try {
      let value = '0'
      const methodParams = [ ...(hasInputs ? parametersValues : []) ]

      if (newEthValue) {
        value = newEthValue
      }

      // We need to check the params to be sure that the constants are in the params.
      // If the constants are in the params we should not invoke a transaction, nor a call method.

      // TODO: [DEV-328] We need to organize consts in one place.
      const doParamsContainUnformatedConstant = Boolean(methodParams.find((paramValue) => paramValue === '$CURRENT_USER'))

      // Send the user information that their write provider is not connected
      // We need to also check if the write provider is on the right network of the transaction

      if (writeEnabled && isTransaction && !doParamsContainUnformatedConstant) {
        emitToEvent(
          EVENT_NAMES.contract.statusChange,
          { value: null, step: 'Triggering write transaction.', status: EVENT_STATUS.pending, methodNameKey },
        )

        try {

          const methodHash = await sendTx({
            writeContract,
            provider,
            correctedMethodName,
            methodParams,
            value,
            notify: notify(blockNativeApiKey, chainId),
            dispatch,
            emitToEvent,
            methodNameKey,
            addToast,
          })

          setResult(methodHash)
        } catch (error) {
          // Do we need to do anything with this error? Maybe no....
        }

      } else if (readEnabled && !isTransaction && !doParamsContainUnformatedConstant) {
        emitToEvent(
          EVENT_NAMES.contract.statusChange,
          { value: null, step: 'Triggering read transaction.', status: EVENT_STATUS.pending, methodNameKey },
        )

        const methodResult = await callMethod({ readContract, correctedMethodName, methodParams, dispatch, isPolling })
        setResult(methodResult)

        emitToEvent(
          EVENT_NAMES.contract.statusChange,
          { value: methodResult, step: 'Triggering read transaction.', status: EVENT_STATUS.resolved, methodNameKey },
        )
      }

      const [ inputs ] = childrenElements.filter(({ id }) => id.includes('input'))
      const { value: autoInvokeValue } = autoInvokeKey || { value: false }
      const shouldAutoInvoke = autoInvokeValue === 'true'
      const shouldClearAllInputValues = inputs?.element && !shouldAutoInvoke

      if (shouldClearAllInputValues) {
        inputs.element.forEach(({ element, shouldAutoClear }) => {
          if (shouldAutoClear) Object.assign(element, { value: '' })
        })
      }
    } catch (err) {
      emitToEvent(
        EVENT_NAMES.contract.statusChange,
        { value: err, step: 'Triggering read/write transaction.', status: EVENT_STATUS.rejected, methodNameKey },
      )
      dispatch({
        type: ACTION_TYPES.confirmed,
        status: {
          msg: 'An error has occured when interacting with your contract.',
          information: err,
          fetching: false,
          inFlight: false,
        },
      })
    }
  }

  // Add trigger to invoke buttons
  useAddInvokeTrigger({ info, handleRunMethod, emitToEvent, methodNameKey })

  // Auto invoke method
  useAutoInvokeMethod({
    info,
    autoInvokeKey,
    isTransaction,
    handleRunMethod,
    readEnabled,
    readContract,
    readChainId,
    POLLING_INTERVAL,
    writeAddress: address,
    setAutoInterval,
    emitToEvent,
    methodNameKey,
  })

  // Display new results in the UI
  useDisplayResults({ childrenElements, result, emitToEvent, methodNameKey })

  return (
    <div style={{ display: 'none' }}>
      Custom Contract last updated:
      {timestamp}
    </div>
  )
}
