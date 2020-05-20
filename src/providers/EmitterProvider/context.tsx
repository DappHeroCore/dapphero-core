import { createContext } from 'react'
import mitt from 'mitt'

// types
import { ListenToEvent, EmitToEvent } from './types'

type StateContext = {
  emitter?: mitt.Emitter;
}

type ActionsContext = {
  listenToEvent: ListenToEvent;
  emitToEvent: EmitToEvent;
}

type Context = {
  state: StateContext;
  actions: ActionsContext;
}

export const EmitterContext = createContext<Context>({
  state: { emitter: null },
  actions: { listenToEvent: null, emitToEvent: null },
})

