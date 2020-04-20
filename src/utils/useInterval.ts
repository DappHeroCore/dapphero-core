import React, { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [ callback ])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [ delay ])
  // invoke immediately once
  useEffect(() => {
    callback()
  }, [])
}
