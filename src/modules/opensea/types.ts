export enum OpenSeaFunctions {
  RETRIEVE_ASSET = 'retrieveAsset',
  RETRIEVE_ASSETS_BY_OWNER = 'retrieveAssetsByOwner',

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
  element: HTMLElement;
}
