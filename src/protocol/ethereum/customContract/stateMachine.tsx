import { useReducer } from 'react'
import { FetchTransport } from '@sentry/browser/dist/transports'

export const ACTION_TYPES = {
  estimateGas: 'ESTIMATE_GAS',
  estimateGasError: 'ESTIMATE_GAS_ERROR',
  error: 'ERROR',
  callMethod: 'CALL_METHOD',
  callMethodError: 'CALL_METHOD_ERROR',
  sendtx: 'SEND_TX',
  txUserSignatureRequested: 'TX_USER_SIGNATURE_REQUESTED',
  txError: 'TX_ERROR',
  txReceipt: 'TX_RECEIPT',
  confirmation: 'CONFIRMATION',
  confirmed: 'CONFIRMED',
  txUpdate: 'TX_UPDATE',
}

export const stateReducer = (state, action) => {
  console.log('stateReducer -> action', action)
  switch (action.type) {
    case ACTION_TYPES.estimateGas:
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
    default:
      return { ...state }
  }

}

