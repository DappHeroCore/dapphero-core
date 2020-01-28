import React, { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'

import * as api from 'api'

import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Activator } from './Activator'

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

export const App: React.FC = () => (
  <ToastProvider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Activator />
    </Web3ReactProvider>
  </ToastProvider>
)
