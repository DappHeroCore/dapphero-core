import { useEffect, useState } from "react";
// This function takes an Instance, the signature of the public method to be called
// The array of args and a callback. The callback should be a: setState(value)
// From the functional compoment above so for example:

// const defaultState = 0
// const [methodState, setMethodState] = useState(defaultState)
// And then the callback passed in would be setMethodState.
export const callPublicMethodWithArgs = async (instance, signature, arg, callback): Promise<string> => {
  let value
  useEffect(() => {
    const run = async() => {
      try {
        value = await instance.methods[signature](arg).call()
        callback(value);
      } catch (error) {
        console.log('In Call Instance Error: ', error)
      }
    }
    run();
  }, [instance, signature, arg])
}

