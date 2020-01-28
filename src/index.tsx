import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import * as serviceWorker from './serviceWorker'

const dappHeroRoot = document.createElement('div')
dappHeroRoot.id = 'dappHero-root'
document.body.appendChild(dappHeroRoot)
ReactDOM.render(<App />, dappHeroRoot)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
