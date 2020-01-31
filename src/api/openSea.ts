/* eslint-disable camelcase */
import Axios from 'axios'
import { logger } from '../logger/customLogger'

const DEFAULT_LIMIT = 12 // MAX 300
const ORDER_BY = 'current_price'
const ORDER_DIRECTION = 'desc'

const OPEN_SEA = {
  baseUrl: 'https://rinkeby-api.opensea.io/api/v1',
  ApiKey: 'd2a31702fd2b4d9abe2f54f656d29fd1',
}
const axios = Axios.create({ headers: { 'X-API-KEY': OPEN_SEA.ApiKey } })

export const retrieveAsset = async ({ contractAddress, tokenId }) => {
  const url = `${OPEN_SEA.baseUrl}/asset/${contractAddress}/${tokenId}`
  const { data } = await axios.get(url)
  return data
}

export const retrieveAssetsByOwner = async ({
  owner,
  limit = DEFAULT_LIMIT,
  orderBy = ORDER_BY,
  orderDirection = ORDER_DIRECTION,
}): Promise<any[]> => {
  const params = { owner, order_by: orderBy, order_direction: orderDirection, limit }
  const { data } = await axios.get(`${OPEN_SEA.baseUrl}/assets`, { params })
  return data
}

export const retrieveAssetsByContract = async ({
  assetContractAddress,
  limit = DEFAULT_LIMIT,
  orderBy = ORDER_BY,
  orderDirection = ORDER_DIRECTION,
}) => {
  const params = {
    limit,
    order_by: orderBy,
    order_direction: orderDirection,
    asset_contract_address: assetContractAddress,
  }
  const { data } = await axios.get(`${OPEN_SEA.baseUrl}/assets`, { params })
  return data
}

export const retrieveAssetsBySearch = async ({
  search,
  limit = DEFAULT_LIMIT,
  orderBy = ORDER_BY,
  orderDirection = ORDER_DIRECTION,
}) => {
  console.log('search:', search)
  const params = { limit, order_by: orderBy, order_direction: orderDirection, search }
  const { data } = await axios.get(`${OPEN_SEA.baseUrl}/assets`, { params })
  return data
}

// ! DEPRECATED
export const openSeaApi = null
