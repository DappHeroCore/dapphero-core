// This function takes an Instance, the signature of the public method to be called
// The array of args and a callback. The callback should be a: setState(value)
// From the functional compoment above so for example:

// const defaultState = 0
// const [methodState, setMethodState] = useState(defaultState)
// And then the callback passed in would be setMethodState.
export const callPublicMethodWithArgs = async (instance, signature, args, callback): Promise<void> => {
  let value
  try {
    value = await instance.methods[signature](...args).call()
  } catch (error) {
    console.log('In Call Instance Error: ', error)
  }
  callback(value)
}

