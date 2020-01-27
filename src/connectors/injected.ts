import { InjectedConnector } from '@web3-react/injected-connector'
// TODO: [DEV-118] pull supported chains from config or consts file
export const injectedConnector = new InjectedConnector({ supportedChainIds: [ 1, 3, 4 ] })
