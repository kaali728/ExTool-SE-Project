export type AssetType = {
  id: string | string[];
  imageUrl: string;
  name: string;
  table: AssetTableObject[];
  serialNumber: string;
  engine: string;
  location: { long: number; lat: number };
  machineHours: number;
  diesel: "";
};

export type AssetTableObject = {
  date: string;
  destination: string;
  status:
    | ASSET_PICK_DROP.ASSET_CREATED
    | ASSET_PICK_DROP.DROPEDOFF
    | ASSET_PICK_DROP.DROP_OFF
    | ASSET_PICK_DROP.PICKEDUP
    | ASSET_PICK_DROP.PICKUP;
  confirmed: boolean;
  report?: string;
  officeNotes?: OfficeNote[];
  hours?: number;
  diesel?: number;
  images?: AssetPictureDownloadUrl;
  additionalImages?: string[];
};

export type OfficeNote = {
  text: string;
  checked: boolean;
};

export type AssetPictures = {
  front: File;
  rightSide: File;
  leftSide: File;
  back: File;
  fuelGuage: File;
  hoursReading: File;
};

export type AssetPictureDownloadUrl = {
  front: string;
  rightSide: string;
  leftSide: string;
  back: string;
  fuelGuage: string;
  hoursReading: string;
};

export type AssetFormData = {
  destination: string;
  date: string;
  report: string;
  officeNotes: OfficeNote[];
  diesel: number;
  hours: number;
  confirmed: boolean;
};

export type AssetFormDataDropOff = AssetFormData & { refuel: number };
