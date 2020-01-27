import React, { useEffect, useState } from 'react'
import * as api from 'api'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { Activator } from './Activator'

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js

export const App: React.FC = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Activator />
  </Web3ReactProvider>
)
