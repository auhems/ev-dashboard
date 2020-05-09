import { KeyValue } from './GlobalType';
import { SiteArea } from './SiteArea';
import { Data } from './Table';

export interface Asset extends Data {
  id: string;
  name: string;
  siteAreaID: string;
  siteArea: SiteArea;
  assetType: string;
  coordinates: number[];
  image: string;
  createdBy: string;
  createdOn: Date;
  lastChangedBy: string;
  lastChangedOn: Date;
}

export const AssetTypes: KeyValue[] = [
  { key: 'CO', value: 'assets.consume' },
  { key: 'PR', value: 'assets.produce' },
];

export enum AssetButtonAction {
  ASSIGN_ASSETS_TO_SITE_AREA = 'assign_assets_to_site_area',
  VIEW_ASSET = 'view_asset',
  EDIT_ASSET = 'edit_asset',
  CREATE_ASSET = 'create_asset',
  VIEW_ASSETS_OF_SITE_AREA = 'view_assets_of_site_area',
  DELETE_ASSET = 'delete_asset',
}

export enum AssetImage {
  NO_IMAGE = 'assets/img/theme/no-logo.png',
}
