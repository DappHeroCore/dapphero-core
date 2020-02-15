import React from 'react'
import * as helpers from 'helpers'
import { ProvidersWrapper } from './ProvidersWrapper'

export const App: React.FC = () => {
  console.info('After many requests, we have turned verbose logging on by default during ethDenver (until the 17)')

  helpers.cookies.startup()

  return (
    <ProvidersWrapper />
  )
}
