

//This function will send an arbitary Transaction. It requires:
export const sendTransactionToContract: any = (
  instance, //The instance of the Contract
  signature, //The Signatuer of the method being invoked
  args, //An array of arguments to be provided if required. 
  accounts, //accounts[0] of the person calling it
  setTxState, //These two areguments are the current state of a tx object in a functional component
  txState, //And the function required to set the state of this tx object
) => {

  //The functional compoment that calls this has something like this: 
  // const defaultState = {
  //   transactionHash: null,
  //   confirmations: null,
  //   receipt: null,
  //   error: null,
  // }
  //const [txState, setTxState] = useState(defaultState)


  //TODO: Keep track of transactions for website owners analytics
  instance.methods[signature](...args)
    .send({ from: accounts[0] })
    .on('transactionHash', function(hash) {
      setTxState(txState => {
        return { ...txState, transactionHash: hash }
      })
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      setTxState(txState => {
        return {
          ...txState,
          confirmations: confirmationNumber,
          receipt,
        }
      })
    })
    .on('receipt', function(receipt) {
      setTxState(txState => {
        return {
          ...txState,
          receipt,
        }
      })
    })
    .on('error', function(error, receipt) {
      setTxState(txState => {
        return {
          ...txState,
          error,
          receipt,
        }
      })
    })
}

