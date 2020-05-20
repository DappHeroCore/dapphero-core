export const POLLING_INTERVAL = 2000
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
}
const apiKeyElement = document.getElementById('dh-apiKey')
export const apiKey = apiKeyElement.getAttribute('data-api')
export const AUTO_INVOKE_INTERVAL = 500

export const REACT_TOAST_AUTODISMISS_INTERVAL = 6000

export const BUBBLE_DEV_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'
export const BUBBLE_PROD_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'

export const BACKEND_DEV_URL = 'https://api.dapphero.io'
export const BACKEND_PROD_URL = 'https://api.dapphero.io'

export const ipfsRoot = 'https://cloudflare-ipfs.com/ipfs/'
