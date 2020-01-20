import React, { FunctionComponent } from 'react'

interface ReducerProps {
  element: HTMLElement
}

export const Reducer: FunctionComponent<ReducerProps> = ({ element }) => {
  const actionType = element.id.split('-')[3]

  switch (actionType) {
  case 'search': {
    return (
      null
    )
  }
  case 'owner': {
    return (
      null
    )
  }
  case 'contract': {
    return (
      null
    )
  }
  default:
    return null
  }
}
