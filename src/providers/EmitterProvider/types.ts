
export type ListenToEvent = (eventName: string, cb: (e: any) => void) => void
export type EmitToEvent = (eventName: string, data: any) => void
