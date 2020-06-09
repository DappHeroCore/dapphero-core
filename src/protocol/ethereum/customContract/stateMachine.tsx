import { VoidSigner } from 'ethers'

export const ACTION_TYPES = {
  malformedInputName: 'MALFORMED_INPUT_NAME',
  estimateGas: 'ESTIMATE_GAS',
  estimateGasError: 'ESTIMATE_GAS_ERROR',
  error: 'ERROR',
  callMethod: 'CALL_METHOD',
  callMethodAutoInvokeFailure: 'CALL_METHOD_AUTO_INVOKE_ERROR',
  callMethodSucces: 'CALL_METHOD_SUCCES',
  callMethodError: 'CALL_METHOD_ERROR',
  callMethodInvalidArguement: 'CALL_METHOD_INVALID_ARG',
  sendtx: 'SEND_TX',
  txNoWriteProviderEnabled: 'TX_NO_WRITE_PROVIDER_ENABLED',
  txUserSignatureRequested: 'TX_USER_SIGNATURE_REQUESTED',
  txError: 'TX_ERROR',
  txReceipt: 'TX_RECEIPT',
  confirmation: 'CONFIRMATION',
  confirmed: 'CONFIRMED',
  txUpdate: 'TX_UPDATE',
  genericContractError: 'GENERIC_CONTRACT_ERROR',
  malformedInputs: 'MALFORMED_INPUTS',
  parametersUndefined: 'PARAMETERS_UNDEFINED',
}

export const stateReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.parametersUndefined:
      return { ...action.status }
    case ACTION_TYPES.malformedInputs:
      return { ...action.status }
    case ACTION_TYPES.callMethod:
      return { ...action.status }
    case ACTION_TYPES.callMethodSucces:
      return { ...action.status }
    case ACTION_TYPES.callMethodAutoInvokeFailure:
      return { ...action.status }
    case ACTION_TYPES.callMethodInvalidArguement:
      return { ...action.status }
    case ACTION_TYPES.callMethodError:
      return { ...action.status }
    case ACTION_TYPES.estimateGas:
      return { ...action.status }
    case ACTION_TYPES.txError:
      return { ...action.status }
    case ACTION_TYPES.sendtx:
      return { ...action.status }
    case ACTION_TYPES.txReceipt:
      return { ...action.status }
    case ACTION_TYPES.confirmation:
      return { ...action.status }
    case ACTION_TYPES.confirmed:
      return { ...action.status }
    case ACTION_TYPES.txUpdate:
      return { ...action.status }
    case ACTION_TYPES.malformedInputName:
      return { ...action.status }
    case ACTION_TYPES.genericContractError:
      return { ...action.status }
    case ACTION_TYPES.txNoWriteProviderEnabled:
      return { ...action.status }
    default:
      return { ...state }
  }
}

export const dsp = {

  estimateGas: {
    start: ({ methodDetails, dispatch }): VoidFunction => dispatch({
      type: ACTION_TYPES.txUserSignatureRequested,
      status: {
        ...methodDetails,
        msg: 'Estimate Gas Cost of Transaction',
        error: false,
        fetching: true,
        inFlight: false,
      },
    }),
    finish: ({ methodDetails, dispatch, estimatedGas }): VoidFunction => dispatch({
      type: ACTION_TYPES.txUserSignatureRequested,
      status: {
        ...methodDetails,
        msg: 'Estimate Gas Cost of Transaction Succedded',
        error: false,
        fetching: true,
        inFlight: false,
        estimatedGas: estimatedGas.toString(),
      },
    }),
    error: ({ methodDetails, dispatch, error }): VoidFunction => dispatch({
      type: ACTION_TYPES.estimateGasError,
      status: {
        ...methodDetails,
        msg: 'Estimate Gas Cost of Transaction Failed',
        error,
        fetching: false,
        inFlight: false,
      },
    }),
  },
  txFlow: {
    sigRequested: ({ methodDetails, dispatch }): VoidFunction => dispatch({
      type: ACTION_TYPES.txUserSignatureRequested,
      status: {
        ...methodDetails,
        msg: 'User signature requsted',
        error: false,
        fetching: true,
        inFlight: false,
      },
    }),
    txNoWriteProviderEnabled: ({ dispatch }): VoidFunction => dispatch({
      type: ACTION_TYPES.txNoWriteProviderEnabled,
      status: {
        msg: 'No blockchain write provider enabled',
        error: false,
        info: true,
        fetching: false,
        inFlight: false,
      },
    }),
    txBroadcast: ({ methodDetails, dispatch, methodResult }): VoidFunction => dispatch({
      type: ACTION_TYPES.txReceipt,
      status: {
        msg: `TX Broadcast.`,
        error: false,
        fetching: true,
        inFlight: true,
        txReceipt: methodResult.hash,
        ...methodDetails,
      },
    }),
    txConfirmed: ({ methodDetails, dispatch, methodResult, receipt }): VoidFunction => dispatch({
      type: ACTION_TYPES.confirmed,
      status: {
        ...methodDetails,
        msg: `Transaction confirmed. Hash: ${methodResult.hash}`,
        error: false,
        fetching: false,
        inFlight: false,
        receipt,
      },
    }),
    txError: ({ methodDetails, dispatch, error }): VoidFunction => dispatch({
      type: ACTION_TYPES.txError,
      status: {
        ...methodDetails,
        msg: `Transaction failed. ${error.message}`,
        error,
        inFlight: false,
        fetching: false,
      },
    } ),
  },
  callFlow: {
    callRequested: ({ methodDetails, dispatch, isPolling }): VoidFunction => dispatch({
      type: ACTION_TYPES.callMethod,
      status: {
        ...methodDetails,
        msg: `Calling public method { ${methodDetails.methodName} }`,
        error: false,
        fetching: true,
        isPolling,
      },
    }),
    callMethodSucces: ({ methodDetails, dispatch, isPolling, methodResult }): VoidFunction => dispatch({
      type: ACTION_TYPES.callMethodSucces,
      status: {
        ...methodDetails,
        msg: `Calling public method { ${methodDetails.methodName} } success.`,
        error: false,
        fetching: false,
        isPolling,
        methodResult,
      },
    }),
    callMethodError: ({ methodDetails, dispatch, isPolling, readContract, error }): VoidFunction => dispatch({
      type: ACTION_TYPES.callMethodError,
      status: {
        ...methodDetails,
        msg: `Error calling method { ${methodDetails.methodName} } on your contract. Reason: { ${error.code} }. Check the console for more details.`,
        isPolling,
        fetching: false,
        error,
      },
    }),
    callMethodAutoInvokeError: ({ methodDetails, dispatch, isPolling, error }): VoidFunction => dispatch({
      type: ACTION_TYPES.callMethodAutoInvokeFailure,
      status: {
        ...methodDetails,
        msg: `Error AutoInvoking { ${methodDetails.methodName} } on your contract with params: { ${methodDetails.methodParams} }. Check the console for more details.`,
        isPolling,
        fetching: false,
        error,
      },
    }),
    callMethodInvalidArguement: ({ methodDetails, dispatch, isPolling, error }): VoidFunction => dispatch({
      type: ACTION_TYPES.callMethodInvalidArguement,
      status: {
        ...methodDetails,
        msg: `Invalid argument { ${methodDetails.methodParams}} for method { ${methodDetails.methodName} }. Check the console for more details.`,
        isPolling,
        fetching: false,
        error,
      },
    }),
  },
}
