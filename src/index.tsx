import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as Sentry from '@sentry/browser'
import { App } from './App'
import * as serviceWorker from './serviceWorker'

Sentry.init({ dsn: 'https://3bc539bbff164146b9beeefa3b57a853@sentry.io/2067741' })

const dappHeroRoot = document.createElement('div')
dappHeroRoot.id = 'dappHero-root'
document.body.appendChild(dappHeroRoot)
ReactDOM.render(<App />, dappHeroRoot)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
