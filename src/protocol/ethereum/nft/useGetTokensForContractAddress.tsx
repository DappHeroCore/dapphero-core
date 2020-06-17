import { useEffect, useState, useContext } from 'react'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { openSeaApi } from './api'

export const useGetTokensForContractAddress = ({ isSingleToken, isMultipleTokens, isAllTokens, parsedTokens, assetContractAddress, assetOwnerAddress, limit, offset, tokens }) => {
  const [ nfts, setNfts ] = useState(null)
  const [ error, setError ] = useState(null)

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  useEffect(() => {
    if (assetOwnerAddress || !assetContractAddress) return

    if (isSingleToken) {
      const [ token ] = parsedTokens
      const simpleErrorMessage = `Error retriving collectibles, check the Console for more details`
      const completeErrorMessage = `We couldn't get collectible ${token} from contract address ${assetContractAddress}`

      openSeaApi.contract
        .getSingleAsset({ assetContractAddress, token })
        .then((nfts) => {
          emitToEvent(
            EVENT_NAMES.nft.loadSingleToken,
            { value: nfts, step: 'Load Single Token', status: EVENT_STATUS.resolved },
          )
          setNfts(nfts)
        })
        .catch((error) => {
          emitToEvent(
            EVENT_NAMES.nft.loadSingleToken,
            { value: error, step: 'Load Single Token', status: EVENT_STATUS.rejected },
          )
          setError({ simpleErrorMessage, completeErrorMessage, error })
        })
    }

    if (isMultipleTokens) {
      const simpleErrorMessage = `Error retriving collectibles, check the Console for more details`
      const completeErrorMessage = `We couldn't get collectibles ${tokens.join(', ')} from contract address ${assetContractAddress}`

      openSeaApi.contract
        .getMultipleAssets({ assetContractAddress, tokens, limit, offset })
        .then((nfts) => {
          emitToEvent(
            EVENT_NAMES.nft.loadMultipleTokens,
            { value: nfts, step: 'Load Single Token', status: EVENT_STATUS.resolved },
          )
          setNfts(nfts)
        })
        .catch((error) => {
          emitToEvent(
            EVENT_NAMES.nft.loadMultipleTokens,
            { value: error, step: 'Load Single Token', status: EVENT_STATUS.rejected },
          )
          setError({ simpleErrorMessage, completeErrorMessage, error })
        })
    }

    if (isAllTokens) {
      const simpleErrorMessage = `Error retriving collectibles, check the Console for more details`
      const completeErrorMessage = `We couldn't get all collectibles from contract address ${assetContractAddress}`

      openSeaApi.contract
        .getAllAssets({ assetContractAddress, limit, offset })
        .then((nfts) => {
          emitToEvent(
            EVENT_NAMES.nft.loadAllTokens,
            { value: nfts, step: 'Load Single Token', status: EVENT_STATUS.resolved },
          )
          setNfts(nfts)
        })
        .catch((error) => {
          emitToEvent(
            EVENT_NAMES.nft.loadAllTokens,
            { value: error, step: 'Load Single Token', status: EVENT_STATUS.rejected },
          )
          setError({ simpleErrorMessage, completeErrorMessage, error })
        })
    }
  }, [ assetContractAddress, offset ])

  return { nfts, error }
}
