import { InjectedConnector } from '@web3-react/injected-connector'
// TODO: [DEV-118] pull supported chains from config or consts file
export const injectedConnector = new InjectedConnector({ supportedChainIds: [ 1, 3, 4, 5, 10, 42, 77, 99, 100 ] })
