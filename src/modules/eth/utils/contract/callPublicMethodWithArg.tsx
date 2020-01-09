import { useEffect, useState } from 'react'
import { useUnitFormatter } from '../element/useUnitFormatter'

export const callPublicMethodWithArgs = async (
  injected,
  instance,
  signature,
  args: any[],
  callback,
  identifiedReturnValue: string | undefined
): Promise<void> => {
  let value
  useEffect(() => {
    const run = async () => {
      try {
        value = await instance.methods[signature](...args).call()
        value = identifiedReturnValue ? value[identifiedReturnValue] : value
        callback(value)
      } catch (error) {
        console.log('In Call Instance Error: ', error)
      }
    }
    run()
  }, [])
}
