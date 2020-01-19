/* eslint-disable max-classes-per-file */
import React, { Component, createContext, useState } from 'react'

export const FeatureContext = createContext(null)

export class FeatureContextProvider extends Component {
  state = { globalConfig: {} }

  render() {
    const { globalConfig } = this.state
    const { children } = this.props
    return (
      <FeatureContext.Provider value={globalConfig}>
        {children}
      </FeatureContext.Provider>
    )
  }
}

export class FeatureContextConsumer extends Component {
  render() (
    <FeatureContext.Consumer value>

  )
}

