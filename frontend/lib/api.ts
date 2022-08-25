import axios from "axios";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { AssetTableObject, AssetType } from "types/global";
import { firestore } from "./firebase";
import { ENGINE } from "./models/assetEnum";

export async function createNewAsset(asset: any) {
  const docRef = await addDoc(collection(firestore, "assets"), {
    name: asset.name,
    serialNumber: asset.serialNumber,
    imageUrl: asset.imageUrl,
    time: asset.time,
    status: asset.status,
    table: asset.table,
    engine: asset.engine,
    location: asset.location,
    machineHours: asset.machineHours,
    diesel: asset.diesel,
  });
  console.log("Document written with ID: ", docRef.id);
  toast.success("Asset created successfully");
  return asset;
}

export async function updateTable(id: any, table: AssetTableObject[]) {
  const assetDoc = doc(firestore, "assets", id);

  await updateDoc(assetDoc, {
    table: table,
  });

  toast.success("Table saved");
}

export async function updateSelectedAsset(id: any, assetData: any){
  const assetDoc = doc(firestore, "assets", id);

  await updateDoc(assetDoc, {...assetData});

  toast.success("Api Fetched Data successfully saved")
}


export async function getAssetStatusAirFleet(serialNumber: string) {
  try {
    const res = await fetch(`/api/airfleet?sn=${serialNumber}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error on Airefleet get status", error);
  }
}
