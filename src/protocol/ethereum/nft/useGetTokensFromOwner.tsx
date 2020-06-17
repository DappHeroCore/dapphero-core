import { useEffect, useState, useContext } from 'react'
import { EmitterContext } from 'providers/EmitterProvider/context'
import { EVENT_NAMES, EVENT_STATUS } from 'providers/EmitterProvider/constants'
import { openSeaApi } from './api'

export const useGetTokensFromOwner = ({ assetOwnerAddress, isAllTokens, parsedTokens, isSingleToken, isMultipleTokens, assetContractAddress, tokens, limit, offset }) => {
  const [ nfts, setNfts ] = useState(null)
  const [ error, setError ] = useState(null)

  const { actions: { emitToEvent } } = useContext(EmitterContext)

  useEffect(() => {
    if (!assetOwnerAddress) return

    if (isSingleToken) {
      const [ token ] = parsedTokens
      const simpleErrorMessage = `We have a problem getting the token, check the Console for more details`
      const completeErrorMessage = `We couldn't get collectible ${token} from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getSingleAsset({ assetOwnerAddress, assetContractAddress, token })
        .then((nfts) => {
          emitToEvent(
            EVENT_NAMES.nft.loadSingleToken,
            { value: nfts, step: 'Load Single Token', status: EVENT_STATUS.resolved },
          )
          setNfts(nfts)
        })
        .catch((error) => setError({ simpleErrorMessage, completeErrorMessage, error }))
    }

    if (isMultipleTokens) {
      const simpleErrorMessage = `We have a problem getting the tokens, check the Console for more details`
      const completeErrorMessage = `We couldn't get collectibles ${tokens.join(', ')} from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getMultipleAssets({ assetOwnerAddress, assetContractAddress, tokens, limit, offset })
        .then((nfts) => {
          emitToEvent(
            EVENT_NAMES.nft.loadMultipleTokens,
            { value: nfts, step: 'Load Single Token', status: EVENT_STATUS.resolved },
          )
          setNfts(nfts)
        })
        .catch((error) => setError({ simpleErrorMessage, completeErrorMessage, error }))
    }

    if (isAllTokens) {
      const simpleErrorMessage = `Error retriving collectibles, check the Console for more details`
      const completeErrorMessage = `We couldn't get the collectibles from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getAllAssets({ assetOwnerAddress, assetContractAddress, limit, offset })
        .then((nfts) => {
          emitToEvent(
            EVENT_NAMES.nft.loadAllTokens,
            { value: nfts, step: 'Load Single Token', status: EVENT_STATUS.resolved },
          )
          setNfts(nfts)
        })
        .catch((error) => setError({ simpleErrorMessage, completeErrorMessage, error }))
    }
  }, [ assetOwnerAddress, offset ])

  return { nfts, error }

}
