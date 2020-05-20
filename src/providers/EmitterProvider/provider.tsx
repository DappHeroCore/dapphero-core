import React, { useMemo, useCallback } from 'react'
import mitt from 'mitt'

// context
import { EmitterContext } from './context'

// types
import { ListenToEvent, EmitToEvent } from './types'

export const EmitterProvider = ({ children }) => {
  const emitter = useMemo(() => mitt(), [])

  const listenToEvent: ListenToEvent = useCallback((eventName, cb) => emitter.on(eventName, cb ), [])
  const emitToEvent: EmitToEvent = useCallback((eventName, data) => emitter.emit(eventName, data ), [])

  const state = useMemo(() => ({ emitter }), [])
  const actions = useMemo(() => ({ listenToEvent, emitToEvent }), [])

  return (
    <EmitterContext.Provider value={{ state, actions }}>
      {children}
    </EmitterContext.Provider>
  )
}

