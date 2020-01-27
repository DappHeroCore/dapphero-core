import React, { useState } from 'react'

export const Reducer = ({ info }) => {
  const { contract, childrenElements, properties, modifiers } = info
  console.log('TCL: Reducer -> info', info)
  console.log('TCL: Reducer -> contract', contract)
  console.log('TCL: Reducer -> modifiers', modifiers)
  console.log('TCL: Reducer -> properties', properties)
  console.log('TCL: Reducer -> childrenElements', childrenElements)

  const [ name, setName ] = useState('')

  return <div>....</div>
}
