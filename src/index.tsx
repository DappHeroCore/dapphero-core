import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import './index.css'
import { App } from './App'

Sentry.init({ dsn: 'https://3bc539bbff164146b9beeefa3b57a853@sentry.io/2067741' })

window.addEventListener('DOMContentLoaded', () => {
  const dappHeroRoot = document.createElement('div')
  dappHeroRoot.id = 'dappHero-root'
  document.body.appendChild(dappHeroRoot)

  ReactDOM.render(<App />, dappHeroRoot)
})
