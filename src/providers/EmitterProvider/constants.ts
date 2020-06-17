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
}

export const EVENT_STATUS = { pending: 'PENDING', resolved: 'RESOLVED', rejected: 'REJECTED' }
