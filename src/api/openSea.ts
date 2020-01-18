import { logger } from 'logger'
import { OpenSeaPort, Network } from 'opensea-js'
import { OpenSeaFunctions } from '../modules/opensea/types'

type web3Provider = any

const DEFAULT_LIMIT = 12
// arbitrary limit...we can revisit this
// opensea defaults to 20, but even that seems too high for our purposes
const ORDER_BY = 'current_price'
// current_price may be best prop to surface highest quality assets
const ORDER_DIRECTION = 'desc'
const DEFAULT_RETRIES = 2

const DEFAULT_API_CONFIG = {
  networkName: 'main',
  apiKey: 'd2a31702fd2b4d9abe2f54f656d29fd1',
}

export const retrieveAsset = (
  provider: web3Provider,
  networkName: Network,
  tokenAddress: string,
  tokenId: string | number,
  retries: number = DEFAULT_RETRIES,
) => new OpenSeaPort(provider, { ...DEFAULT_API_CONFIG, networkName }).api.getAsset(tokenAddress, tokenId, retries).catch((error) => { logger.debug(error); return 'There was an error' })

export const retrieveAssetsByOwner = (
  provider: web3Provider,
  networkName: Network,
  { owner, limit = DEFAULT_LIMIT, orderBy = ORDER_BY, orderDirection = ORDER_DIRECTION },
  page: number = 1,
) => new OpenSeaPort(provider, { ...DEFAULT_API_CONFIG, networkName }).api.getAssets({
  owner,
  limit,
  order_by: orderBy, // eslint-disable-line
  order_direction: orderDirection, // eslint-disable-line
}, page).catch((error) => { logger.debug(error); return 'There was an error' })

export const retrieveAssetsByConract = (
  provider: web3Provider,
  networkName: Network,
  { assetContractAddress, limit = DEFAULT_LIMIT, orderBy = ORDER_BY, orderDirection = ORDER_DIRECTION },
  page: number = 1,
) => new OpenSeaPort(provider, { ...DEFAULT_API_CONFIG, networkName }).api.getAssets({
  asset_contract_address: assetContractAddress, // eslint-disable-line
  limit,
  order_by: orderBy, // eslint-disable-line
  order_direction: orderDirection, // eslint-disable-line
}, page).catch((error) => { logger.debug(error); return 'There was an error' })

export const retrieveAssetsBySearch = (
  provider: web3Provider,
  networkName: Network,
  { search, limit = DEFAULT_LIMIT, orderBy = ORDER_BY, orderDirection = ORDER_DIRECTION },
  page: number = 1,
) => new OpenSeaPort(provider, { ...DEFAULT_API_CONFIG, networkName }).api.getAssets({
  search,
  limit,
  order_by: orderBy, // eslint-disable-line
  order_direction: orderDirection, // eslint-disable-line
}, page).catch((error) => { logger.debug(error); return 'There was an error' })

// ! DEPRECATED
export const openSeaApi = async (provider: any, func: string, args: string[]) => {
  // TODO: If not connected to Mainnet or Rinkeby, we need to bubble up error and inform User. jira
  const networkName = provider.networkVersion === '1' ? Network.Main : Network.Rinkeby
  const seaport = new OpenSeaPort(provider, { ...DEFAULT_API_CONFIG, networkName })

  switch (func) {
  case OpenSeaFunctions.RETRIEVE_ASSET: {
    return seaport.api.getAsset(args[0], args[1]).catch((error) => { logger.debug(error); return error })
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_OWNER: {
    return seaport.api.getAssets({
      owner: args[0],
      limit: DEFAULT_LIMIT,
      order_by: ORDER_BY, // eslint-disable-line
      order_direction: ORDER_DIRECTION, // eslint-disable-line
    }).catch((error) => { logger.debug(error); return error })
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_CONTRACT: {
    return seaport.api.getAssets({
      asset_contract_address: args[0], // eslint-disable-line
      limit: DEFAULT_LIMIT,
      order_by: ORDER_BY, // eslint-disable-line
      order_direction: ORDER_DIRECTION, // eslint-disable-line
    }).catch((error) => { logger.debug(error); return error })
  }

  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_SEARCH:
  case OpenSeaFunctions.RETRIEVE_ASSETS_BY_SEARCH_INPUT: {
    if (!args[0]) return null
    return seaport.api.getAssets({
      search: args[0],
      limit: DEFAULT_LIMIT,
      order_by: ORDER_BY, // eslint-disable-line
      order_direction: ORDER_DIRECTION, // eslint-disable-line
    }).catch((error) => { logger.debug(error); return error })
  }

  default: {
    return null
  }
  }
}
