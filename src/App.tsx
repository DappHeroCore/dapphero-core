import React from 'react'
import * as helpers from 'helpers'
import { ProvidersWrapper } from './ProvidersWrapper'
import { logger } from './logger/customLogger'

export const App: React.FC = () => {

  helpers.cookies.startup()

  return (
    <ProvidersWrapper />
  )
}
