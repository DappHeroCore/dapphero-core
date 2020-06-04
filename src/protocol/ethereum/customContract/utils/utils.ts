import Notify from 'bnc-notify'
import * as consts from 'consts'
import * as utils from 'utils'
import omit from 'lodash.omit'
import { ACTION_TYPES } from '../stateMachine'
// Utils
export const notify = (apiKey, chainId) => Notify({ dappId: apiKey, networkId: chainId })
// Constants
const ANONYMOUS_EMPTY_STRING_OLD_VERSION = '$true'

export const getAbiMethodInputs = (abi, methodName, dispatch): Record<string, any> => {
  const parseName = (value: string): string => (value === '' ? ANONYMOUS_EMPTY_STRING_OLD_VERSION : value)
  const method = abi.find(({ name }) => name === methodName)
  if (!method) {
    dispatch({
      type: ACTION_TYPES.malformedInputName,
      status: {
        error: true,
        msg: `The method name: { ${methodName} } is incorrect. Perhaps a typo in your html?`,
      },
    })
    return null
  }

  const parsedMethod = Object.assign(method, {
    inputs: method.inputs.map((input) => {
      const anonymousInputCount = method.inputs.filter(({ name }) => name === '').length
      return { ...input, name: anonymousInputCount ? input.name : parseName(input.name) }
    }),
  })

  const output = parsedMethod.inputs.reduce((acc, input, index) => {
    const { name } = input
    return ({ ...acc, [name || `[${index}]`]: '' })
  }, {})

  return output
}
// Helpers - Get parameters values
export const getParametersFromInputValues = ({ info, methodName, dispatch, address, methodNameKey, ethValue }): Record<string, any> => {
  let newEthValue = ethValue
  const { childrenElements, contract } = info
  const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
  let abiMethodInputs = getAbiMethodInputs(contract.contractAbi, methodName, dispatch)
  if (!inputChildrens.length ) return { parameterValues: [] }
  const [ inputs ] = inputChildrens
  inputs.element.forEach(({ element, argumentName }) => {
    const rawValue = element.value
    const value = address ? (rawValue.replace(consts.clientSide.currentUser, address) ?? rawValue) : rawValue
    try {
      const displayUnits = element.getAttribute('data-dh-modifier-display-units')
      const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
      const convertedValue = value && (displayUnits || contractUnits) ? utils.convertUnits(displayUnits, contractUnits, value) : value
      if (convertedValue) {
        if (argumentName === ANONYMOUS_EMPTY_STRING_OLD_VERSION) {
          abiMethodInputs = { [ANONYMOUS_EMPTY_STRING_OLD_VERSION]: convertedValue }

        } else {
          Object.assign(abiMethodInputs, { [argumentName]: convertedValue })
        }
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.malformedInputs,
        status: {
          error: true,
          fetching: false,
          msg: `There seems to be an error with your inputs? Argument Name: ${argumentName}`,
          methodNameKey,
        },
      })
    }
    // TODO: Check if we need to re-assign the input value (with Drake)
    element.value = value
  })
  if (abiMethodInputs?.EthValue) {
    newEthValue = abiMethodInputs?.EthValue
  }
  const parsedParameters = omit(abiMethodInputs, 'EthValue')
  const parametersEntries = Object.entries(parsedParameters)
  let parametersValues = Object.values(parsedParameters)
  const getKeyPosition = (key) => key.match(/\d+/g) || [ 0 ]
  if (Object.keys(parsedParameters).includes('[')) {
    parametersValues = [ ...parametersEntries ].sort((a, b) => {
      const [ keyA, keyB ] = [ a, b ]
      const [ positionA, positionB ] = [ getKeyPosition(keyA), getKeyPosition(keyB) ]
      return Number(positionA) - Number(positionB)
    })
  }
  return { parametersValues, newEthValue }
}
// Determin if function is overloaded
export const findReplaceOverloadedMethods = ({ methodName, contractAbi, parametersValues }) => {
  // If contract is not overloaded, return the methodName
  if (contractAbi.filter((el) => el.name === methodName).length <= 1) return methodName
  // Now we know we are overloaded and we need to find what the inputs should be.
  const selectedMethod = contractAbi.find((el) => el.inputs.length === parametersValues.length)
  // now we need to map through the abi inputs returning the value of internalType, and concatinating.
  return `${methodName}(${selectedMethod.inputs.map((input) => input.internalType)})`
}
