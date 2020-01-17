import React, { createContext } from 'react'
import PropTypes from 'prop-types'

const HTMLContext = createContext({})

function HTMLContextProvider(props) {
  const initialContextValue = {
    elements: [],
    setElements: () => [] // needed?
  }
  const dappHeroTopLevelModule = 'dh' // MOCK THIS FOR NOW BUT LATER SHOULD COME FROM DATABASE

  // TODO: run all elements through sanitizing function to protect us
  // for example: someone could inject JS in id tag
  const elements: any[] = Array.prototype.slice.call(document.querySelectorAll(`[id^=${dappHeroTopLevelModule}]`))

  const requests = elements.map((element) => {
    const domElementId = element.id
    const requestString = domElementId.split('-')
    const index = 1
    return {
      requestString,
      element,
      arg: requestString[index],
      index
    }
  })

  const { children } = props
  return (
    <HTMLContext.Provider value={{ elements, requests }}>
      {children}
    </HTMLContext.Provider>
  )
}

function HTMLContextConsumer(props) {
  const { children } = props
  return <HTMLContext.Consumer>{children}</HTMLContext.Consumer>
}

// HTMLContextProvider.propTypes = { children: PropTypes.element.isRequired }

// HTMLContextConsumer.propTypes = { children: PropTypes.symbol.isRequired }

export { HTMLContextProvider, HTMLContextConsumer }
