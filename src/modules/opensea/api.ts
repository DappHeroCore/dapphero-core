import { OpenSeaPort, Network } from 'opensea-js'
import { OpenSeaFunctions } from './types'

const ITEM_LIMIT = 12
// arbitrary limit...we can revisit this
// opensea defaults to 20, but even that seems too high for our purposes
const ORDER_BY = 'current_price'
// current_price may be best prop to surface highest quality assets
const ORDER_DIRECTION = 'desc'

export const openSeaApi = async (
  provider: any,
  func: string,
  args: string[]
) => {
  const networkName = provider.networkVersion === '1' ? Network.Main : Network.Rinkeby
  const seaport = new OpenSeaPort(provider, { networkName })

  switch (func) {
  case OpenSeaFunctions.RETRIEVE_ASSET: {
    return seaport.api.getAsset(args[0], args[1])
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_OWNER: {
    return seaport.api.getAssets({
      owner: args[0],
      limit: ITEM_LIMIT,
      order_by: ORDER_BY,
      order_direction: ORDER_DIRECTION
    })
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_CONTRACT: {
    return seaport.api.getAssets({
      asset_contract_address: args[0],
      limit: ITEM_LIMIT,
      order_by: ORDER_BY,
      order_direction: ORDER_DIRECTION
    })
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_SEARCH:
  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_SEARCH_INPUT: {
    if (!args[0]) return null
    return seaport.api.getAssets({
      search: args[0],
      limit: ITEM_LIMIT,
      order_by: ORDER_BY,
      order_direction: ORDER_DIRECTION
    })
  }

  default: {
    return null
  }
  }
}
