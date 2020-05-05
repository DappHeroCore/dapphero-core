import React from 'react'
import * as helpers from 'helpers'
import { ProvidersWrapper } from './ProvidersWrapper'

export const App: React.FC = () => {
  console.info('==========================')
  console.info('A MESSAGE FROM DAPPHERO')
  console.info('This software is currently in ALPHA, please be careful.')
  console.info('There is no warranty, everything is at your own risk.')
  console.info('Ask for help on Telegram:\nhttps://t.me/dapphero')
  console.info('Docs: https://docs.dapphero.io')
  console.info('==========================')

  helpers.cookies.startup()

  return (
    <ProvidersWrapper />
  )
}
