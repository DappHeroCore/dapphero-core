import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import * as helpers from 'helpers'
import { ProvidersWrapper } from './ProvidersWrapper'

export const App: React.FC = () => {
  console.info('==========================')
  console.info('A MESSAGE FROM DAPPHERO')
  console.info('Ask for help on Telegram:\nhttps://t.me/dapphero')
  console.info('Docs: https://docs.dapphero.io')
  console.info('==========================')

  helpers.cookies.startup()

  return (
    <Router>
      <ProvidersWrapper />
    </Router>
  )
}
