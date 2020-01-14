import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import * as serviceWorker from './serviceWorker'

// The root here could eventually be random.
const dappHeroRootIdTag = 'dh-root' // This should eventually be loaded somehow from a config file.

const root = document.createElement('DIV')
root.id = dappHeroRootIdTag
document.body.appendChild(root)

ReactDOM.render(<App />, root)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
