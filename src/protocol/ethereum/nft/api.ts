/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import Axios from 'axios'
import queryString from 'query-string'

const OPEN_SEA = {
  baseUrl: {
    mainnet: 'https://api.opensea.io/api/v1/',
    rinkeby: 'https://rinkeby-api.opensea.io/api/v1/',
  },
  apiKey: process.env.REACT_APP_OPENSEA_API_KEY,
}

const axios = Axios.create({
  baseURL: OPEN_SEA.baseUrl.mainnet,
  headers: { 'X-API-KEY': OPEN_SEA.apiKey },
  transformResponse: [
    function (data) {
      const parsedData = JSON.parse(data)
      const { assets } = parsedData

      return assets
    },
  ],
})

const getData = ({ data }) => data

const getOpenSeaResource = (query: string) => axios.get(`assets?${query}`).then(getData)

export const openSeaApi = {
  owner: {
    getSingleAsset: ({ assetOwnerAddress, assetContractAddress, token }) => {
      const query = queryString.stringify({ owner: assetOwnerAddress, token_ids: token, asset_contract_address: assetContractAddress })
      return getOpenSeaResource(query)
    },
    getMultipleAssets: ({ assetOwnerAddress, assetContractAddress, tokens, limit, offset }) => {
      const query = queryString.stringify({ owner: assetOwnerAddress, token_ids: tokens, asset_contract_address: assetContractAddress, limit, offset })
      return getOpenSeaResource(query)
    },
    getAllAssets: ({ assetOwnerAddress, assetContractAddress, limit, offset }) => {
      const query = queryString.stringify({ owner: assetOwnerAddress, asset_contract_address: assetContractAddress, limit, offset })
      return getOpenSeaResource(query)
    },
  },
  contract: {
    getSingleAsset: ({ assetContractAddress, token }) => {
      const query = queryString.stringify({ asset_contract_address: assetContractAddress, token_ids: token })
      return getOpenSeaResource(query)
    },
    getMultipleAssets: ({ assetContractAddress, tokens, limit, offset }) => {
      const query = queryString.stringify({ asset_contract_address: assetContractAddress, token_ids: tokens, limit, offset })
      return getOpenSeaResource(query)
    },
    getAllAssets: ({ assetContractAddress, limit, offset }) => {
      const query = queryString.stringify({ asset_contract_address: assetContractAddress, limit, offset })
      return getOpenSeaResource(query)
    },
  },
}
