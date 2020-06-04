import { useEffect } from 'react'
import * as utils from 'utils'
import { EVENT_NAMES } from 'providers/EmitterProvider/constants'
import { getStringFormattedArrayIndiceValue } from '../../../utils/getStringFormattedArrayIndiceValue'

export const useDisplayResults = ({ childrenElements, result, emitToEvent, methodNameKey }): void => {
  useEffect(() => {
    if (result) {
      const parsedValue = result

      const outputsChildrenElements = childrenElements.find(({ id }) => id.includes('outputs'))
      const outputNamedChildrenElements = childrenElements.find(({ id }) => id.includes('outputName'))

      if (outputsChildrenElements?.element) {
        outputsChildrenElements.element.forEach(({ element }) => {

          if (typeof result === 'string' || typeof result === 'object') {
            const displayUnits = element.getAttribute('data-dh-modifier-display-units')
            const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
            const decimals = (element.getAttribute('data-dh-modifier-decimal-units')
                || element.getAttribute('data-dh-modifier-decimals'))
              ?? null

            // Check if the element has a dataset value
            const dataSetValue = element.dataset.dhPropertyOutputs
            // This will return either a number, or "false". It is possible to return "0", this is not "false".
            const arrayIndiceValue = getStringFormattedArrayIndiceValue(dataSetValue)

            // This function either returns the full object, or the specific index of the object, and converts it if required.
            const convertedValue = (): any => {
              // TODO: Notes, that arrayIndiceValue can return a "0" which does not equal "false", however it also returns "false"
              const value = (arrayIndiceValue !== false) ? result[arrayIndiceValue] : result
              return (value && (displayUnits || contractUnits)
                ? utils.convertUnits(contractUnits, displayUnits, value)
                : value)
            }

            const isNumber = !Number.isNaN(Number(convertedValue))
            if (decimals && isNumber) {
              const decimalConvertedValue = Number(convertedValue)
                .toFixed(decimals)
                .toString()
              element.innerText = decimalConvertedValue
            } else {
              Object.assign(element, { textContent: convertedValue })
            }

            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: convertedValue, element, methodNameKey })
          } else {
            Object.assign(element, { textContent: parsedValue })
            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: parsedValue, element, methodNameKey })
          }

        })
      }

      if (outputNamedChildrenElements?.element) {
        outputNamedChildrenElements.element.forEach(({ element }) => {
          const outputName = element.getAttribute('data-dh-property-output-name')
          const displayUnits = element.getAttribute('data-dh-modifier-display-units')
          const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
          const decimals = (element.getAttribute('data-dh-modifier-decimal-units')
              || element.getAttribute('data-dh-modifier-decimals'))
            ?? null
          const convertedValue = parsedValue[outputName] && (displayUnits || contractUnits)
            ? utils.convertUnits(contractUnits, displayUnits, parsedValue[outputName])
            : parsedValue[outputName]
          const isNumber = !Number.isNaN(Number(convertedValue))

          if (decimals && isNumber) {
            const decimalConvertedValue = Number(convertedValue)
              .toFixed(decimals)
              .toString()
            element.innerText = decimalConvertedValue

            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: decimalConvertedValue, element })
          } else {
            Object.assign(element, { textContent: convertedValue })
            emitToEvent(EVENT_NAMES.contract.outputUpdated, { value: convertedValue, element })
          }
        })
      }

    }
  }, [ result ])

  return null
}
