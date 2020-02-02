export type InputOutput = {
  name: string
  type: string
}

export type ABI = {
  constant?: boolean
  anonymous?: boolean
  name: string
  outputs: InputOutput[]
  inputs: InputOutput[]
  payable: boolean
  stateMutability: string
  type: string
}

export type Configuration = {
  contractName: string
  contractAddress: string
  contractAbi: ABI[]
  network: number
  projectId: string
}

export type FeatureReducerProps = {
  feature?: string
  element: HTMLElement | Element
  configuration: Configuration
  key?: string
  index?: number
  info?: any
}
