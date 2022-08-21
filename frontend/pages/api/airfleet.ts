// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Asset = {
  id: number;
  code: string;
  type: string;
  make: string;
  model: string;
  year: number;
  serialNumber: string;
}

type StatusData = {
    id: number,
    statusDateTime: string,
    speed: number,
    odometer: number,
    engineHours: number,
    voltage: number,
    locationDateTime: string,
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string
}



//TODO: RESPONSE TYPE
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusData>
) {
  const assetSerialNumber = req.query.sn;
  
  const auth = {
    username: "Parshome@yahoo.com",
    password: "12345678Aa1",
  };  
  const headers = {
    Authorization: `Basic ${
      Buffer
      .from(auth.username + ":" + auth.password, "utf-8")
      .toString("base64")}`
  };
  
  const allAssetsUrl =  "https://api.airiqfleet.com/v2/fleets/4419/assets";
  
  const assetsFetch = await fetch(allAssetsUrl, {method: 'GET', headers});
  const assets = await assetsFetch.json();
  
  const assetIndex = assets.findIndex((asset: Asset) => asset.serialNumber === assetSerialNumber);
  const assetId = assets[assetIndex].id;

  const assetUrl = `https://api.airiqfleet.com/v2/assets/${assetId}/status`;
  
  const getAssetStatus = await fetch(assetUrl, {method: 'GET', headers});

  const data = await getAssetStatus.json();
  
  res.status(200).json(data);
}
