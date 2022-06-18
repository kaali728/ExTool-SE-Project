export type AssetType = {
  id: string;
  imageUrl: string;
  name: string;
  table: any;
  serialNumber: string;
  engine: string;
  location: { long: number; lat: number };
  machineHours: number;
};