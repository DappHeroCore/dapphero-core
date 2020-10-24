export const POLLING_INTERVAL = 3000
export const ethNetworkName = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  60: 'GoChain',
  77: 'Sokol',
  99: 'Core',
  100: 'Xdai',
  80001: 'maticMumbaiTestnet',
}
const apiKeyElement = document.getElementById('dh-apiKey')
export const apiKey = apiKeyElement.getAttribute('data-api')
export const AUTO_INVOKE_INTERVAL = 3000

export const AUTO_INVOKE_DYNAMIC = {
  'slow-2g': 20000,
  '2g': 10000,
  '3g': 5000,
  '4g': 3000,
}

export const REACT_TOAST_AUTODISMISS_INTERVAL = 6000

export const BUBBLE_DEV_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'
export const BUBBLE_PROD_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'

export const BACKEND_DEV_URL = 'https://api.dapphero.io'
export const BACKEND_PROD_URL = 'https://api.dapphero.io'
