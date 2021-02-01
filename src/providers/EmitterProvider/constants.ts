export const EVENT_NAMES = {
  contract: {
    statusChange: 'contract:statusChange',
    outputUpdated: 'contract:outputUpdated',
    autoInvoke: 'contract:autoInvokeChange',
    invokeTrigger: 'contract:invokeTriggerChange',
    contractEvent: 'contract:contractEvent',
  },
  user: {
    addressStatusChange: 'address:statusChange',
    balanceStatusChange: 'balance:statusChange',
  },
  nft: {
    loadSingleToken: 'nft:loadSingleToken',
    loadMultipleTokens: 'nft:loadMultipleTokens',
    loadAllTokens: 'nft:loadAllTokens',
  },
  threeBox: { loadProfile: 'threebox:loadProfile' },
  ethTransfer: { sendEther: 'ethTransfer:sendEther' },
}

export const EVENT_STATUS = { pending: 'PENDING', resolved: 'RESOLVED', rejected: 'REJECTED' }
