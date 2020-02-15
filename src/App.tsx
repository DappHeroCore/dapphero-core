import React from 'react'
import * as helpers from 'helpers'
import { ProvidersWrapper } from './ProvidersWrapper'

export const App: React.FC = () => {
  console.info('==========================')
  console.info('A MESSAGE FROM DAPPHERO:\nAfter many requests, we have turned verbose logging on by default during ethDenver (until the 17)')
  console.info('Ask for help on Telegram:\nhttps://t.me/dapphero')
  console.info('Docs: https://docs.dapphero.io')
  console.info('==========================')

  helpers.cookies.startup()

  return (
    <ProvidersWrapper />
  )
}
