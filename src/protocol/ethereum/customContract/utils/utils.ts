import Notify from 'bnc-notify'
import * as consts from 'consts'
import * as utils from 'utils'
import omit from 'lodash.omit'
import { ACTION_TYPES } from '../stateMachine'

// Utils

export const notify = (apiKey, chainId) => Notify({ dappId: apiKey, networkId: chainId })

export const getAbiMethodInputs = (abi, methodName, dispatch): Record<string, any> => {
  const emptyString = '$true'
  const parseName = (value: string): string => (value === '' ? emptyString : value)

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

  const parsedMethod = Object.assign(method, { inputs: method.inputs.map((input) => ({ ...input, name: parseName(input.name) })) })

  const output = parsedMethod.inputs.reduce((acc, { name }) => ({ ...acc, [name]: '' }), [])
  return output
}

// Helpers - Get parameters values
export const getParametersFromInputValues = ({ info, methodName, dispatch, address, methodNameKey, ethValue }): Record<string, any> => {

  const { childrenElements } = info

  const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))
  const abiMethodInputs = getAbiMethodInputs(info.contract.contractAbi, methodName, dispatch)

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
        Object.assign(abiMethodInputs, { [argumentName]: convertedValue })
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
    ethValue = abiMethodInputs?.EthValue
  }

  const parsedParameters = omit(abiMethodInputs, 'EthValue')
  const parametersValues = Object.values(parsedParameters)

  return { parametersValues }
}
