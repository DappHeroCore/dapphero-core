import { OpenSeaPort, Network } from 'opensea-js'
import { OpenSeaFunctions } from './types'

export const openSeaApi = async (
  provider: any,
  func: string,
  args: string[]
) => {
  const seaport = new OpenSeaPort(provider, { networkName: Network.Rinkeby })

  switch (func) {
  case OpenSeaFunctions.RETRIEVE_ASSET: {
    const result = await seaport.api.getAsset(args[0], args[1])
    return result
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_OWNER: {
    const result = await seaport.api.getAssets({ owner: args[0] })
    return result
  }

  default: {
    return null
  }
  }
}
