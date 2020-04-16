import { useEffect } from 'react'
import * as utils from 'utils'
import * as consts from 'consts'

export const useAddTriggersToInputElements = (info, ethValueKey, setParameters, address) => {
  const { childrenElements } = info

  // Add triggers to input elements
  useEffect(() => {
    const inputChildrens = childrenElements.filter(({ id }) => id.includes('input'))

    if (inputChildrens.length > 0) {
      const [ inputs ] = inputChildrens
      const tearDowns = inputs.element.map((input) => {
        const { element, argumentName } = input

        const clickHandlerFunction = (rawValue: string): void => {
          // I don't understand what this is doing. - dennison
          const value = address
            ? rawValue.replace(consts.clientSide.currentUser, address) ?? rawValue
            : rawValue

          try {
            const displayUnits = element.getAttribute('data-dh-modifier-display-units')
            const contractUnits = element.getAttribute('data-dh-modifier-contract-units')
            const convertedValue = value && (displayUnits || contractUnits) ? utils.convertUnits(displayUnits, contractUnits, value) : value

            if (convertedValue) {
              setParameters((prevParameters) => ({
                ...prevParameters,
                [argumentName]: convertedValue,
              }))
            }
          } catch (err) {
            console.warn('There may be an issue with your inputs')
          }

          element.value = value
        }

        const ethValue = ethValueKey?.value

        clickHandlerFunction(element.value)

        const clickHandler = (event): void => {
          const rawValue = ethValue ?? event.target.value
          clickHandlerFunction(rawValue)
        }

        element.addEventListener('input', clickHandler)

        // Edge case where JS or jQuery uses .value property or .val() method
        // const temporaryValue = null
        // const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')

        // Object.defineProperty(element, 'value', {
        //   get() {
        //     return get.call(this)
        //   },
        //   set(newVal) {
        //     set.call(this, newVal)

        //     if (temporaryValue !== newVal) {
        //       temporaryValue = newVal
        //       clickHandlerFunction(newVal)
        //     }

        //     return newVal
        //   },
        // })

        return (): void => {
          element.removeEventListener('input', clickHandler)
        }
      })

      return (): void => {
        tearDowns.forEach((cb) => cb())
      }
    }
  }, [ childrenElements, address ])
}
