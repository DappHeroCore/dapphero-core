export enum OpenSeaFunctions {
  RETRIEVE_ASSET = 'retrieveAsset',
  RETRIEVE_ASSETS_BY_OWNER = 'retrieveAssetsByOwner',
  RETRIEVE_ASSETS_BY_CONTRACT = 'retrieveAssetsByContract',
  RETRIEVE_ASSETS_BY_SEARCH = 'retrieveAssetsBySearch',
  RETRIEVE_ASSETS_BY_SEARCH_INPUT = 'retrieveAssetsBySearchInput',
  ASSET_PAGE = 'asset_page'
}

export enum OpenSeaRequestString {
  FUNCTION = 3,
  ARGUMENTS = 4
}

export type OpenSeaViewProps = {
  requestString: string[];
  networkName: string;
  provider: any;
  func: string;
  signifiers: { [key: string]: any };
  injected: { [key: string]: any };
  element: HTMLElement;
}

// TODO: have designer create custom fallback(s)
export enum OpenSeaFallbacks {
  GIF = 'https://media.giphy.com/media/26xBIygOcC3bAWg3S/giphy.gif'
}
