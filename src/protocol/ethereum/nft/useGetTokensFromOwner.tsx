import { useEffect, useState } from 'react'
import { openSeaApi } from './api'

export const useGetTokensFromOwner = ({ assetOwnerAddress, isAllTokens, parsedTokens, isSingleToken, isMultipleTokens, assetContractAddress, tokens, limit, offset }) => {
  const [ nfts, setNfts ] = useState(null)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    if (!assetOwnerAddress) return
    let isSuscribed = true

    const handleSetNfts = (nfts): void => {
      if (isSuscribed) setNfts(nfts)
    }

    if (isSingleToken) {
      const [ token ] = parsedTokens
      const simpleErrorMessage = `We have a problem getting the token, check the Console for more details`
      const completeErrorMessage = `We couldn't get collectible ${token} from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getSingleAsset({ assetOwnerAddress, assetContractAddress, token })
        .then(handleSetNfts)
        .catch((error) => setError({ simpleErrorMessage, completeErrorMessage, error }))
    }

    if (isMultipleTokens) {
      const simpleErrorMessage = `We have a problem getting the tokens, check the Console for more details`
      const completeErrorMessage = `We couldn't get collectibles ${tokens.join(', ')} from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getMultipleAssets({ assetOwnerAddress, assetContractAddress, tokens, limit, offset })
        .then(handleSetNfts)
        .catch((error) => setError({ simpleErrorMessage, completeErrorMessage, error }))
    }

    if (isAllTokens) {
      const simpleErrorMessage = `Error retriving collectibles, check the Console for more details`
      const completeErrorMessage = `We couldn't get the collectibles from owner ${assetOwnerAddress}`

      openSeaApi.owner
        .getAllAssets({ assetOwnerAddress, assetContractAddress, limit, offset })
        .then(handleSetNfts)
        .catch((error) => setError({ simpleErrorMessage, completeErrorMessage, error }))
    }

    return (): void => {
      isSuscribed = false
    }
  }, [ ])

  return { nfts, error }

}
